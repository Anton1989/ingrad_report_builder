import WebpackIsomorphicTools from 'webpack-isomorphic-tools';
import path from 'path';
import webpackConfig from '../../webpack/webpack-isomorphic-tools';

var rootDir = path.resolve(__dirname, '../..');
global.ENV_IS_SERVER = true;
global.ENV_DEVELOPMENT = process.env.NODE_ENV !== 'production';
global.ENV_HOST = process.env.SERVER;
global.ENV_PORT = process.env.SERVER_PORT;

if (ENV_DEVELOPMENT) {
    if (!require('piping')({
        hook: true,
        ignore: /(\/\.|~$|\.json|\.scss$)/i
    })) {
        throw new Error('Failed to start erver, due to "piping" plugin is not installed');
    }
}

global.webpackIsomorphicTools = new WebpackIsomorphicTools(webpackConfig)
    .server(rootDir, function() {
        require('./server');
    });