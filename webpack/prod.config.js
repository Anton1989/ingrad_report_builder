require('babel-polyfill');

// Webpack config for creating the production bundle.
var path = require('path');
var webpack = require('webpack');
var CleanPlugin = require('clean-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var CompressionPlugin = require('compression-webpack-plugin');
var WebpackIsomorphicToolsPlugin = require('webpack-isomorphic-tools/plugin');
var strip = require('strip-loader');
var projectRootPath = path.resolve(__dirname, '../');
var assetsPath = path.join(projectRootPath, 'src/backend/static/bundle');
var webpackIsomorphicToolsPlugin = new WebpackIsomorphicToolsPlugin(require('./webpack-isomorphic-tools'));

module.exports = {
  devtool: 'source-map',
  context: path.resolve(__dirname, '..'),
  entry: [
    './src/frontend/index'
  ],
  output: {
    path: assetsPath,
    filename: '[name]-[chunkhash].js',
    chunkFilename: '[name]-[chunkhash].js',
    publicPath: '/dist/'
  },
  module: {
    loaders: [
      { test: /\.jsx?$/, exclude: /node_modules/, loaders: [strip.loader('debug'), 'babel-loader']},
      { test: /\.json$/, loader: 'json-loader' },
      {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
            use: [{
                loader: 'css-loader',
                options: {
                    sourceMap: true,
                    importLoaders: 1,
                    minimize: true,
                    modules: 1,
                    localIdentName: '[local]--[hash:base64:5]'
                }
            }, {
                loader: 'sass-loader'
            }],
            // use style-loader in development
            fallback: 'style-loader'
        })
      },
      { test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=10000&mimetype=image/svg+xml' }
    ]
  },
  plugins: [
    new CleanPlugin([assetsPath], { root: projectRootPath }),

    // css files from the extract-text-plugin loader
    new ExtractTextPlugin({
      allChunks: true,

      filename: '[name]-[chunkhash].css' 
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: "'production'"
      },
      ENV_IS_SERVER: false,
      ENV_DEVELOPMENT: false
    }),

    // ignore dev config
    new webpack.IgnorePlugin(/\.\/dev/, /\/config$/),

    // optimizations
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.LoaderOptionsPlugin({
        minimize: true,
        debug: false
    }),
    new webpack.optimize.UglifyJsPlugin({
      beautify: false,
      compress: {
          warnings: false,
          screw_ie8: true
      },
      comments: false,
      sourceMap: false,
      mangle: true,
      minimize: true
    }),
    new CompressionPlugin({
        asset: '[file].gz',
        algorithm: 'gzip',
        test: /\.js$|\.html$/,
        threshold: 10240,
        minRatio: 0.8
    }),
    webpackIsomorphicToolsPlugin
  ]
};
