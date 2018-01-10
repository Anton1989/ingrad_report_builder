import React from 'react';
import { renderToString } from 'react-dom/server';
import match from 'react-router/lib/match';
import RouterContext from 'react-router/lib/RouterContext';
import configureStore from '../../frontend/flux/store';
import Provider from 'react-redux/lib/components/Provider';
import routes from '../../frontend/routes';
import config from '../config';

module.exports = function (request, response, next) {
    console.log('Middleware Url is: ' + request.url);
    response.setHeader('Last-Modified', (new Date()).toUTCString());
    if (ENV_DEVELOPMENT) {
        // Do not cache webpack stats: the script file would change since
        // hot module replacement is enabled in the development env
        webpackIsomorphicTools.refresh();
    }

    match({ routes: routes({}), location: request.url }, (err, redirect, props) => {
        if (err) {
            console.log('Warning: serverSideRendering middleware routing failed, try backend routing');
            next()
        } else if (redirect) {
            console.log('Log: serverSideRendering middleware trigger redirect');
            request.session.redirectURL = request.url;
            response.redirect(redirect.pathname + redirect.search)
        } else if (props) {
            console.log('Log: serverSideRendering middleware found route');
            
            let initialState = JSON.parse(JSON.stringify(config.initialState));
            const store = configureStore(initialState);
            try {
                const appHtml = renderToString(
                    <Provider store={store}>
                        <RouterContext {...props} />
                    </Provider>
                );
                response.send(renderPage(appHtml, store))
            } catch(e) {
                console.error(e)
                response.send('[ERROR] for details view server logs!')
            }
        } else {
            console.log('Log: serverSideRendering middleware does\'t found route, try backend routing');
            next()
        }
    })
}
function renderPage(appHtml, store) {
    const assets = webpackIsomorphicTools.assets();
    const finalState = store.getState();
    const jsBundle = assets.javascript.main;
    
    const cssBundle = assets.styles.main;
    const cssTag = cssBundle ? `<link rel="stylesheet" href="${cssBundle}">` : null;
    return `<!DOCTYPE html>
        <html>
        <head>
        <!-- Latest compiled and minified CSS -->
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/latest/css/bootstrap.min.css">
        <!-- Optional theme -->
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/latest/css/bootstrap-theme.min.css">
        ${cssTag}
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
        <title>STARTER BY AAA</title>
        <script>
            window.__INITIAL_STATE__ = ${JSON.stringify(finalState)}
        </script>
        </head>
        <body>
        <div id="root">${appHtml}</div>
        <script src="${jsBundle}"></script>
        </body>
    </html>`
}
