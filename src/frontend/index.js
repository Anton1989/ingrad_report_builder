import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import Provider from 'react-redux/lib/components/Provider';
import browserHistory from 'react-router/lib/browserHistory';
import Router from 'react-router/lib/Router';
import configureStore from './flux/store';
import routes from './routes';

const store = configureStore(window.__INITIAL_STATE__);
delete window.__INITIAL_STATE__;
const history = browserHistory;

ReactDOM.render(
    <Provider store={store}>
        <Router routes={routes({})} history={history} />
    </Provider>,
    document.getElementById('root')
);