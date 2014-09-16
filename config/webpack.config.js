/*!
 * Facebook React Starter Kit | https://github.com/kriasoft/React-Seed
 * Copyright (c) KriaSoft, LLC. All rights reserved. See LICENSE.txt
 */

/*
 * Webpack configuration. For more information visit
 * http://webpack.github.io/docs/configuration
 */

var webpack = require('webpack');

module.exports = function (release) {
  return {
    output: {
      publicPatch: './build/',
      path: './build/',
      filename: 'app.js'
    },

    cache: !release,
    debug: !release,
    devtool: false,
    entry: './src/app.jsx',

    stats: {
      colors: true,
      reasons: !release
    },

    plugins: release ? [
      new webpack.DefinePlugin({'process.env.NODE_ENV': '"production"'}),
      new webpack.optimize.DedupePlugin(),
      new webpack.optimize.UglifyJsPlugin(),
      new webpack.optimize.OccurenceOrderPlugin(),
      new webpack.optimize.AggressiveMergingPlugin()
    ] : [],

    module: {
      preLoaders: [
        {
          test: '\\.js$',
          exclude: 'node_modules',
          loader: 'jshint'
        }
      ],

      loaders: [
        {
          test: /\.css$/,
          loader: 'style!css'
        },
        {
          test: /\.gif/,
          loader: 'url-loader?limit=10000&mimetype=image/gif'
        },
        {
          test: /\.jpg/,
          loader: 'url-loader?limit=10000&mimetype=image/jpg'
        },
        {
          test: /\.png/,
          loader: 'url-loader?limit=10000&mimetype=image/png'
        },
        {
          test: /\.jsx$/,
          loader: 'jsx-loader?harmony'
        }
      ]
    }
  };
};
