/*
 * React.js Starter Kit
 * Copyright (c) Konstantin Tarkus (@koistya), KriaSoft LLC
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _webpack = require('webpack');

var _webpack2 = _interopRequireDefault(_webpack);

var _lodashObjectMerge = require('lodash/object/merge');

var _lodashObjectMerge2 = _interopRequireDefault(_lodashObjectMerge);

var _autoprefixerCore = require('autoprefixer-core');

var _autoprefixerCore2 = _interopRequireDefault(_autoprefixerCore);

var _minimist = require('minimist');

var _minimist2 = _interopRequireDefault(_minimist);

var argv = (0, _minimist2['default'])(process.argv.slice(2));
var DEBUG = !argv.release;
var STYLE_LOADER = 'style-loader/useable';
var CSS_LOADER = DEBUG ? 'css-loader' : 'css-loader?minimize';
var AUTOPREFIXER_BROWSERS = ['Android 2.3', 'Android >= 4', 'Chrome >= 20', 'Firefox >= 24', 'Explorer >= 8', 'iOS >= 6', 'Opera >= 12', 'Safari >= 6'];
var GLOBALS = {
  'process.env.NODE_ENV': DEBUG ? '"development"' : '"production"',
  '__DEV__': DEBUG
};

//
// Common configuration chunk to be used for both
// client-side (app.js) and server-side (server.js) bundles
// -----------------------------------------------------------------------------

var config = {
  output: {
    publicPath: './',
    sourcePrefix: '  '
  },

  cache: DEBUG,
  debug: DEBUG,

  stats: {
    colors: true,
    reasons: DEBUG
  },

  plugins: [new _webpack2['default'].optimize.OccurenceOrderPlugin()],

  resolve: {
    extensions: ['', '.webpack.js', '.web.js', '.js', '.jsx']
  },

  module: {
    preLoaders: [{
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'eslint-loader'
    }],

    loaders: [{
      test: /\.css$/,
      loader: STYLE_LOADER + '!' + CSS_LOADER + '!postcss-loader'
    }, {
      test: /\.less$/,
      loader: STYLE_LOADER + '!' + CSS_LOADER + '!postcss-loader!less-loader'
    }, {
      test: /\.gif/,
      loader: 'url-loader?limit=10000&mimetype=image/gif'
    }, {
      test: /\.jpg/,
      loader: 'url-loader?limit=10000&mimetype=image/jpg'
    }, {
      test: /\.png/,
      loader: 'url-loader?limit=10000&mimetype=image/png'
    }, {
      test: /\.svg/,
      loader: 'url-loader?limit=10000&mimetype=image/svg+xml'
    }, {
      test: /\.jsx?$/,
      exclude: /node_modules/,
      loader: 'babel-loader'
    }]
  },

  postcss: [(0, _autoprefixerCore2['default'])(AUTOPREFIXER_BROWSERS)]
};

//
// Configuration for the client-side bundle (app.js)
// -----------------------------------------------------------------------------

var appConfig = (0, _lodashObjectMerge2['default'])({}, config, {
  entry: './src/app.js',
  output: {
    path: './build/public',
    filename: 'app.js'
  },
  devtool: DEBUG ? 'source-map' : false,
  plugins: config.plugins.concat([new _webpack.DefinePlugin((0, _lodashObjectMerge2['default'])(GLOBALS, { '__SERVER__': false }))].concat(DEBUG ? [] : [new _webpack2['default'].optimize.DedupePlugin(), new _webpack2['default'].optimize.UglifyJsPlugin(), new _webpack2['default'].optimize.AggressiveMergingPlugin()]))
});

//
// Configuration for the server-side bundle (server.js)
// -----------------------------------------------------------------------------

var serverConfig = (0, _lodashObjectMerge2['default'])({}, config, {
  entry: './src/server.js',
  output: {
    path: './build',
    filename: 'server.js',
    libraryTarget: 'commonjs2'
  },
  target: 'node',
  externals: /^[a-z][a-z\.\-0-9]*$/,
  node: {
    console: false,
    global: false,
    process: false,
    Buffer: false,
    __filename: false,
    __dirname: false
  },
  devtool: DEBUG ? 'source-map' : 'cheap-module-source-map',
  plugins: config.plugins.concat(new _webpack.DefinePlugin((0, _lodashObjectMerge2['default'])(GLOBALS, { '__SERVER__': true })), new _webpack.BannerPlugin('require("source-map-support").install();', { raw: true, entryOnly: false })),
  module: {
    loaders: config.module.loaders.map(function (loader) {
      // Remove style-loader
      return (0, _lodashObjectMerge2['default'])(loader, {
        loader: loader.loader = loader.loader.replace(STYLE_LOADER + '!', '')
      });
    })
  }
});

exports['default'] = [appConfig, serverConfig];
module.exports = exports['default'];
