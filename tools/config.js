/**
 * React Starter Kit (http://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2015 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import path from 'path';
import webpack, { DefinePlugin, BannerPlugin } from 'webpack';
import merge from 'lodash/object/merge';

const DEBUG = !process.argv.includes('release');
const WATCH = global.WATCH === undefined ? false : global.WATCH;
const VERBOSE = process.argv.includes('verbose');
const STYLE_LOADER = 'style-loader/useable';
const CSS_LOADER = DEBUG ? 'css-loader' : 'css-loader?minimize';
const AUTOPREFIXER_BROWSERS = [
  'Android 2.3',
  'Android >= 4',
  'Chrome >= 20',
  'Firefox >= 24',
  'Explorer >= 8',
  'iOS >= 6',
  'Opera >= 12',
  'Safari >= 6'
];
const GLOBALS = {
  'process.env.NODE_ENV': DEBUG ? '"development"' : '"production"',
  '__DEV__': DEBUG
};

//
// Common configuration chunk to be used for both
// client-side (app.js) and server-side (server.js) bundles
// -----------------------------------------------------------------------------

const config = {
  output: {
    publicPath: '/',
    sourcePrefix: '  '
  },

  cache: DEBUG,
  debug: DEBUG,

  stats: {
    colors: true,
    reasons: DEBUG,
    hash: VERBOSE,
    version: VERBOSE,
    timings: true,
    chunks: VERBOSE,
    chunkModules: VERBOSE,
    cached: VERBOSE,
    cachedAssets: VERBOSE
  },

  plugins: [
    new webpack.optimize.OccurenceOrderPlugin()
  ],

  resolve: {
    extensions: ['', '.webpack.js', '.web.js', '.js', '.jsx']
  },

  module: {
    loaders: [{
      test: /\.txt/,
      loader: 'file-loader?name=[path][name].[ext]'
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
      test: /\.eot/,
      loader: 'url-loader?limit=100000&mimetype=application/vnd.ms-fontobject'
    }, {
      test: /\.woff2/,
      loader: 'url-loader?limit=100000&mimetype=application/font-woff2'
    }, {
      test: /\.woff/,
      loader: 'url-loader?limit=100000&mimetype=application/font-woff'
    }, {
      test: /\.ttf/,
      loader: 'url-loader?limit=100000&mimetype=application/font-ttf'
    }, {
      test: /\.jsx?$/,
      include: [
        path.resolve(__dirname, '../node_modules/react-routing/src'),
        path.resolve(__dirname, '../src')
      ],
      loaders: [...(WATCH && ['react-hot']), 'babel-loader']
    }]
  },

  postcss: [
    require('postcss-nested')(),
    require('cssnext')(),
    require('autoprefixer-core')(AUTOPREFIXER_BROWSERS)
  ]
};

//
// Configuration for the client-side bundle (app.js)
// -----------------------------------------------------------------------------

const appConfig = merge({}, config, {
  entry: [
    ...(WATCH && ['webpack-hot-middleware/client']),
    './src/app.js'
  ],
  output: {
    path: path.join(__dirname, '../build/public'),
    filename: 'app.js'
  },
  devtool: DEBUG ? 'source-map' : false,
  plugins: [
    ...config.plugins,
    new DefinePlugin(merge({}, GLOBALS, {'__SERVER__': false})),
    ...(!DEBUG && [
      new webpack.optimize.DedupePlugin(),
      new webpack.optimize.UglifyJsPlugin({compress: {warnings: VERBOSE}}),
      new webpack.optimize.AggressiveMergingPlugin()
    ]),
    ...(WATCH && [
      new webpack.HotModuleReplacementPlugin()
    ])
  ],
  module: {
    loaders: [...config.module.loaders, {
      test: /\.css$/,
      loader: `${STYLE_LOADER}!${CSS_LOADER}!postcss-loader`
    }]
  }
});

//
// Configuration for the server-side bundle (server.js)
// -----------------------------------------------------------------------------

const serverConfig = merge({}, config, {
  entry: './src/server.js',
  output: {
    path: './build',
    filename: 'server.js',
    libraryTarget: 'commonjs2'
  },
  target: 'node',
  externals: [
    function (context, request, cb) {
      var isExternal =
        request.match(/^[a-z][a-z\/\.\-0-9]*$/i) &&
        !request.match(/^react-routing/) &&
        !context.match(/[\\/]react-routing/);
      cb(null, Boolean(isExternal));
    }
  ],
  node: {
    console: false,
    global: false,
    process: false,
    Buffer: false,
    __filename: false,
    __dirname: false
  },
  devtool: DEBUG ? 'source-map' : 'cheap-module-source-map',
  plugins: [
    ...config.plugins,
    new DefinePlugin(merge({}, GLOBALS, {'__SERVER__': true})),
    new BannerPlugin('require("source-map-support").install();',
      { raw: true, entryOnly: false })
  ],
  module: {
    loaders: [...config.module.loaders, {
      test: /\.css$/,
      loader: `${CSS_LOADER}!postcss-loader`
    }]
  }
});

export default [appConfig, serverConfig];
