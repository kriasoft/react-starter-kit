/**
 * React Starter Kit (http://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2015 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import browserSync from 'browser-sync';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';

global.WATCH = true;
const config = require('./config')[0]; // Client-side bundle configuration
const bundler = webpack(config);

/**
 * Launches a development web server with "live reload" functionality -
 * synchronizing URLs, interactions and code changes across multiple devices.
 */
export default async () => {
  await require('./build')();
  await require('./serve')();

  browserSync({
    proxy: {

      target: 'localhost:5000',

      middleware: [
        webpackDevMiddleware(bundler, {
          // IMPORTANT: dev middleware can't access config, so we should
          // provide publicPath by ourselves
          publicPath: config.output.publicPath,

          // pretty colored output
          stats: config.stats,

          hot: true,
          historyApiFallback: true,

          // for other settings see
          // http://webpack.github.io/docs/webpack-dev-middleware.html
        }),

        // bundler should be the same as above
        webpackHotMiddleware(bundler),
      ],
    },

    // no need to watch '*.js' here, webpack will take care of it for us,
    // including full page reloads if HMR won't work
    files: [
      'build/public/**/*.css',
      'build/public/**/*.html',
      'build/content/**/*.*',
      'build/templates/**/*.*',
    ],
  });
};
