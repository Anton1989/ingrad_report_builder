import { createStore, applyMiddleware } from 'redux';
import rootReducer from './reducer';
import createLogger from 'redux-logger';
import thunk from 'redux-thunk';
import createSagaMiddleware from 'redux-saga';
import statusSaga from '../modules/status/saga/statusSaga';
import docsSaga from '../modules/docs/saga/docsSaga';

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


    sagaMiddleware.run(statusSaga);
    sagaMiddleware.run(docsSaga);

    return store
}
