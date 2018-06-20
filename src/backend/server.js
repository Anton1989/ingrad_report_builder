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

if (ENV_DEVELOPMENT === false) {
    app.use('*.js', setBundleHeaders); // USE GZIP COMPRESSION FOR PRODUCTION BUNDLE
    app.use('/dist', express.static(__dirname + '/static/bundle'));
}
app.use('/css', express.static(__dirname + '/static/css'));
app.use('/images', express.static(__dirname + '/static/images'));
app.use('/files', express.static(__dirname + '/static/files'));
app.use('/js', express.static(__dirname + '/static/bundle'));
app.use('/favicon.ico', express.static(__dirname + '/static/images/favicon.ico'));
app.use(ServerRenderingMiddleware);

let api = new ApiConfig(app);

db.connection.on('connected', function () {
    console.log('==> ⛁ Connection with MongoDB (' + ENV_MONGO_HOST + '/' + ENV_MONGO_DB + ') established successfully.');
});

const options = {
    pfx: fs.readFileSync('./gis.ingrad.com.pfx'),
    passphrase: '123456'
};

https.createServer(options, app).listen(ENV_PORT, ENV_HOST, function(error) {
    if (error) {
        console.error('APP ERROR:', error);
    } else {
        console.info('==> 🌎 Web APP listening on port %s. Open up https://%s:%s/ in your browser.', ENV_PORT, ENV_HOST, ENV_PORT);
    }
});