require('babel-polyfill');

// Webpack config for development
var path = require('path');
var webpack = require('webpack');
var host = process.env.SERVER;
var port = Number(process.env.SERVER_PORT);

// https://github.com/halt-hammerzeit/webpack-isomorphic-tools
var WebpackIsomorphicToolsPlugin = require('webpack-isomorphic-tools/plugin');
var webpackIsomorphicToolsPlugin = new WebpackIsomorphicToolsPlugin(require('./webpack-isomorphic-tools'));
var babelrcObject = {
    'plugins': [
        'transform-runtime',
        'add-module-exports',
        'transform-decorators-legacy',
        'transform-react-display-name'
    ],
    'env': {
        'development': {
            'plugins': [
                'typecheck',
                [
                    'react-transform', {
                        'transforms': [
                            {
                                'transform': 'react-transform-catch-errors',
                                'imports': ['react', 'redbox-react']
                            }
                        ]
                    }
                ]
            ]
        }
    }
}

var babelrcObjectDevelopment = babelrcObject.env && babelrcObject.env.development || {};

// merge global and dev-only plugins
var combinedPlugins = babelrcObject.plugins || [];
combinedPlugins = combinedPlugins.concat(babelrcObjectDevelopment.plugins);

var babelLoaderQuery = Object.assign({}, babelrcObjectDevelopment, babelrcObject, {plugins: combinedPlugins});
delete babelLoaderQuery.env;

// Since we use .babelrc for client and server, and we don't want HMR enabled on the server, we have to add
// the babel plugin react-transform-hmr manually here.

// make sure react-transform is enabled
babelLoaderQuery.plugins = babelLoaderQuery.plugins || [];
var reactTransform = null;
for (var i = 0; i < babelLoaderQuery.plugins.length; ++i) {
    var plugin = babelLoaderQuery.plugins[i];
    if (Array.isArray(plugin) && plugin[0] === 'react-transform') {
        reactTransform = plugin;
    }
}

if (!reactTransform) {
    reactTransform = ['react-transform', {transforms: []}];
    babelLoaderQuery.plugins.push(reactTransform);
}

if (!reactTransform[1] || !reactTransform[1].transforms) {
    reactTransform[1] = Object.assign({}, reactTransform[1], {transforms: []});
}

// make sure react-transform-hmr is enabled
reactTransform[1].transforms.push({
    transform: 'react-transform-hmr',
    imports: ['react'],
    locals: ['module']
});

module.exports = {
    devtool: 'inline-source-map',
    context: path.resolve(__dirname, '..'),
    entry: {
        'main': [
            'webpack-hot-middleware/client?path=http://' + host + ':' + port + '/__webpack_hmr',
            './src/frontend/index'
        ]
    },
    output: {
        path: path.resolve(__dirname, '../dist'),
        filename: '[name]-[hash].js',
        chunkFilename: '[name]-[chunkhash].js',
        publicPath: 'http://' + host + ':' + port + '/dist/'
    },
    module: {
        loaders: [
            { test: /\.jsx?$/, exclude: /node_modules/, loaders: ['babel-loader?' + JSON.stringify(babelLoaderQuery), 'eslint-loader']},
            { test: /\.json$/, loader: 'json-loader' },
            {
                test: /\.scss$/,
                use: [
                    {
                        loader: 'style-loader',
                        query: {
                            sourceMap: 1
                        }
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            sourceMap: true,
                            importLoaders: 1,
                            modules: 1,
                            localIdentName: '[name]__[local]--[hash:base64:5]'
                        }
                    },
                    {
                        loader: 'sass-loader',
                        options: {
                            sourceMap: true,
                            includePaths: [path.resolve(__dirname, 'frontend')]
                        }
                    }
                ]
            },
            { test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=10000&mimetype=image/svg+xml' }
        ]
    },
    plugins: [
        // hot reload
        new webpack.HotModuleReplacementPlugin(),
        new webpack.IgnorePlugin(/webpack-stats\.json$/),
        new webpack.DefinePlugin({
            ENV_IS_SERVER: false,
            ENV_DEVELOPMENT: true
        }),
        webpackIsomorphicToolsPlugin.development()
    ]
};
