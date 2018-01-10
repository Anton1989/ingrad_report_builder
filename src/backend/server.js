import express from 'express';
//Custome middlewares
import ServerRenderingMiddleware from './middleware/serverSideRendering';
import setBundleHeaders from './middleware/setBundleHeaders';
import ApiConfig from './api/index';

var app = new express();

if (!ENV_HOST || !ENV_PORT) {
    throw new Error('Web APP failed on start, incorrect host (' + ENV_HOST + ') or port (' + ENV_PORT + ') were setted in envirement.');
}

if (ENV_DEVELOPMENT === false) {
    app.use('*.js', setBundleHeaders); // USE GZIP COMPRESSION FOR PRODUCTION BUNDLE
    app.use('/dist', express.static(__dirname + '/static/bundle'));
}
app.use('/css', express.static(__dirname + '/static/css'));
app.use('/images', express.static(__dirname + '/static/images'));
app.use('/js', express.static(__dirname + '/static/bundle'));
app.use('/favicon.ico', express.static(__dirname + '/static/images/favicon.ico'));
app.use(ServerRenderingMiddleware);

let api = new ApiConfig(app);

app.listen(ENV_PORT, ENV_HOST, function(error) {
    if (error) {
        console.error('APP ERROR:', error);
    } else {
        console.info('==> 🌎 Web APP listening on port %s. Open up http://%s:%s/ in your browser.', ENV_PORT, ENV_HOST, ENV_PORT);
    }
});