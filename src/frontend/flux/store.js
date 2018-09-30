import { createStore, applyMiddleware } from 'redux';
import rootReducer from './reducer';
import createLogger from 'redux-logger';
import thunk from 'redux-thunk';
import createSagaMiddleware from 'redux-saga';
import projectSaga from '../modules/projects/saga/projectSaga';
import placesSaga from '../modules/map/saga/placesSaga';
import stylesSaga from '../modules/styles/saga/stylesSaga';
import pdSaga from '../modules/pd/saga/pdSaga';
import kpiSaga from '../modules/kpi/saga/kpiSaga';
import panoramSaga from '../modules/map/saga/panoramSaga';
import layerSaga from '../modules/map/saga/layerSaga';
import buildLayer from '../modules/map/saga/buildSaga';

const sagaMiddleware = createSagaMiddleware();

export default function configureStore(initialState) {
    const logger = createLogger();
    const store = createStore(rootReducer, initialState, applyMiddleware(thunk, logger, sagaMiddleware));

    if (module.hot) {
        module.hot.accept('./reducer', () => {
            const nextRootReducer = require('./reducer').default
            store.replaceReducer(nextRootReducer)
        })
    }

    sagaMiddleware.run(projectSaga);
    sagaMiddleware.run(placesSaga);
    sagaMiddleware.run(stylesSaga);
    sagaMiddleware.run(pdSaga);
    sagaMiddleware.run(kpiSaga);
    sagaMiddleware.run(panoramSaga);
    sagaMiddleware.run(layerSaga);
    sagaMiddleware.run(buildLayer);
    return store
}
