import express from 'express';
import db from 'mongoose';
import https from 'https';
import fs from 'fs';
//Custome middlewares
import ServerRenderingMiddleware from './middleware/serverSideRendering';
import setBundleHeaders from './middleware/setBundleHeaders';
import ApiConfig from './api/index';

var app = new express();
db.Promise = global.Promise;
db.connect('mongodb://' + ENV_MONGO_HOST + '/' + ENV_MONGO_DB);

if (!ENV_HOST || !ENV_PORT) {
    throw new Error('Web APP failed on start, incorrect host (' + ENV_HOST + ') or port (' + ENV_PORT + ') were setted in envirement.');
}

const CORE = CORE_URL == '/' ? '' : CORE_URL;

if (ENV_DEVELOPMENT === false) {
    app.use('*.js', setBundleHeaders); // USE GZIP COMPRESSION FOR PRODUCTION BUNDLE
    app.use(CORE + '/dist', express.static(__dirname + '/static/bundle'));
}
app.use(CORE + '/css', express.static(__dirname + '/static/css'));
app.use(CORE + '/images', express.static(__dirname + '/static/images'));
app.use(CORE + '/files', express.static(__dirname + '/static/files'));
app.use(CORE + '/js', express.static(__dirname + '/static/bundle'));
app.use(CORE + '/favicon.ico', express.static(__dirname + '/static/images/favicon.ico'));
app.use(ServerRenderingMiddleware);

let api = new ApiConfig(app);

db.connection.on('connected', function () {
    console.log('==> ⛁ Connection with MongoDB (' + ENV_MONGO_HOST + '/' + ENV_MONGO_DB + ') established successfully.');
});

let server = null;

if (ENV_DEVELOPMENT) {
    server = app;
} else {
    const options = {
        pfx: fs.readFileSync('./gis.ingrad.com.pfx'),
        passphrase: '123456'
    };
    server = https.createServer(options, app);
}

server.listen(ENV_PORT, ENV_HOST, function(error) {
    if (error) {
        console.error('APP ERROR:', error);
    } else {
        console.info('==> 🌎 Web APP listening on port %s. Open up http://%s:%s/ in your browser.', ENV_PORT, ENV_HOST, ENV_PORT);
    }
});