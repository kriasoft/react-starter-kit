/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import browserSync from 'browser-sync';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import config from './webpack.config';
import run from './run';
import clean from './clean';
import copy from './copy';
import compileServer from './compileServer';
import runServer from './runServer';

/**
 * Launches a development web server with "live reload" functionality -
 * synchronizing URLs, interactions and code changes across multiple devices.
 */
async function start() {
  await run(clean);
  await Promise.all([
    run(copy),
    run(compileServer),
  ]);
  await new Promise(resolve => {
    // Hot Module Replacement (HMR) + React Hot Reload
    if (config.debug) {
      config.entry.unshift('react-hot-loader/patch', 'webpack-hot-middleware/client');
      config.output.filename = config.output.filename.replace('[chunkhash]', '[hash]');
      config.output.chunkFilename = config.output.chunkFilename.replace('[chunkhash]', '[hash]');
      config.module.loaders.find(x => x.loader === 'babel-loader')
        .query.plugins.unshift('react-hot-loader/babel');
      config.plugins.push(new webpack.HotModuleReplacementPlugin());
      config.plugins.push(new webpack.NoErrorsPlugin());
    }

    const compiler = webpack(config);

    let handleServerBundleComplete = async () => {
      const server = await runServer();
      const bs = browserSync.create();
      bs.init({
        ...(config.debug ? {} : { notify: false, ui: false }),

        proxy: {
          target: server.host,
          middleware: [
            webpackDevMiddleware(compiler, {
              // IMPORTANT: webpack middleware can't access config,
              // so we should provide publicPath by ourselves
              publicPath: config.output.publicPath,

              // Pretty colored output
              stats: config.stats,

              // For other settings see
              // https://webpack.github.io/docs/webpack-dev-middleware
            }),

            // compiler should be the same as above
            webpackHotMiddleware(compiler),
          ],
        },
      }, resolve);
      handleServerBundleComplete = runServer;
    };

    compiler.run(handleServerBundleComplete);
  });
}

export default start;
