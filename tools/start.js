/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import path from 'path';
import express from 'express';
import browserSync from 'browser-sync';
import webpack from 'webpack';
import logApplyResult from 'webpack/hot/log-apply-result';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import createLaunchEditorMiddleware from 'react-error-overlay/middleware';
import webpackConfig from './webpack.config';
import run, { format } from './run';
import clean from './clean';

const isDebug = !process.argv.includes('--release');

// https://webpack.js.org/configuration/watch/#watchoptions
const watchOptions = {
  // Watching may not work with NFS and machines in VirtualBox
  // Uncomment next line if it's your case (use true or interval in milliseconds)
  // poll: true,

  // Decrease CPU or memory usage in some file systems
  // ignored: /node_modules/,
};

function createCompilationPromise(name, compiler, config) {
  return new Promise((resolve, reject) => {
    let timeStart = new Date();
    compiler.plugin('compile', () => {
      timeStart = new Date();
      console.info(`[${format(timeStart)}] Compiling '${name}'...`);
    });
    compiler.plugin('done', (stats) => {
      console.info(stats.toString(config.stats));
      const timeEnd = new Date();
      const time = timeEnd.getTime() - timeStart.getTime();
      if (stats.hasErrors()) {
        console.info(`[${format(timeEnd)}] Failed to compile '${name}' after ${time} ms`);
        reject(new Error('Compilation failed!'));
      } else {
        console.info(`[${format(timeEnd)}] Finished '${name}' compilation after ${time} ms`);
        resolve(stats);
      }
    });
  });
}

let server;

/**
 * Launches a development web server with "live reload" functionality -
 * synchronizing URLs, interactions and code changes across multiple devices.
 */
async function start() {
  if (server) return server;
  server = express();
  server.use(createLaunchEditorMiddleware());
  server.use(express.static(path.resolve(__dirname, '../public')));

  // Configure client-side hot module replacement
  const clientConfig = webpackConfig.find(config => config.name === 'client');
  clientConfig.entry.client = [
    'react-error-overlay',
    'react-hot-loader/patch',
    'webpack-hot-middleware/client?name=client&reload=true',
  ].concat(clientConfig.entry.client).sort((a, b) => b.includes('polyfill') - a.includes('polyfill'));
  clientConfig.output.filename = clientConfig.output.filename.replace('chunkhash', 'hash');
  clientConfig.output.chunkFilename = clientConfig.output.chunkFilename.replace('chunkhash', 'hash');
  clientConfig.module.rules = clientConfig.module.rules.filter(x => x.loader !== 'null-loader');
  const { query } = clientConfig.module.rules.find(x => x.loader === 'babel-loader');
  query.plugins = ['react-hot-loader/babel'].concat(query.plugins || []);
  clientConfig.plugins.push(
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
  );

  // Configure server-side hot module replacement
  const serverConfig = webpackConfig.find(config => config.name === 'server');
  serverConfig.output.hotUpdateMainFilename = 'updates/[hash].hot-update.json';
  serverConfig.output.hotUpdateChunkFilename = 'updates/[id].[hash].hot-update.js';
  serverConfig.module.rules = serverConfig.module.rules.filter(x => x.loader !== 'null-loader');
  serverConfig.plugins.push(
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.NamedModulesPlugin(),
  );

  // Configure compilation
  await run(clean);
  const multiCompiler = webpack(webpackConfig);
  const clientCompiler = multiCompiler.compilers.find(compiler => compiler.name === 'client');
  const serverCompiler = multiCompiler.compilers.find(compiler => compiler.name === 'server');
  const clientPromise = createCompilationPromise('client', clientCompiler, clientConfig);
  const serverPromise = createCompilationPromise('server', serverCompiler, serverConfig);

  // https://github.com/webpack/webpack-dev-middleware
  server.use(webpackDevMiddleware(clientCompiler, {
    publicPath: clientConfig.output.publicPath,
    quiet: true,
    watchOptions,
  }));

  // https://github.com/glenjamin/webpack-hot-middleware
  server.use(webpackHotMiddleware(clientCompiler, { log: false }));

  let appPromise;
  let appPromiseResolve;
  let appPromiseIsResolved = true;
  serverCompiler.plugin('compile', () => {
    if (!appPromiseIsResolved) return;
    appPromiseIsResolved = false;
    appPromise = new Promise(resolve => (appPromiseResolve = resolve));
  });

  let app;
  server.use((req, res) => {
    appPromise.then(() => app.handle(req, res)).catch(error => console.error(error));
  });

  function checkForUpdate(fromUpdate) {
    return app.hot.check().then((updatedModules) => {
      if (updatedModules) {
        return app.hot.apply().then((renewedModules) => {
          logApplyResult(updatedModules, renewedModules);
          checkForUpdate(true);
        });
      }
      if (fromUpdate) {
        return console.info('[HMR] Update applied.');
      }
      return console.warn('[HMR] Cannot find update.');
    }).catch((error) => {
      if (['abort', 'fail'].includes(app.hot.status())) {
        console.warn('[HMR] Cannot apply update.');
        delete require.cache[require.resolve('../build/server')];
        // eslint-disable-next-line global-require, import/no-unresolved
        app = require('../build/server').default;
        console.warn('[HMR] App has been reloaded.');
      } else {
        console.warn(`[HMR] Update failed: ${error.stack || error.message}`);
      }
    });
  }

  serverCompiler.watch(watchOptions, (error, stats) => {
    if (app && !error && !stats.hasErrors()) {
      checkForUpdate().then(() => {
        appPromiseIsResolved = true;
        appPromiseResolve();
      });
    }
  });

  // Wait until both client-side and server-side bundles are ready
  await clientPromise;
  await serverPromise;

  const timeStart = new Date();
  console.info(`[${format(timeStart)}] Launching server...`);

  // Load compiled src/server.js as a middleware
  // eslint-disable-next-line global-require, import/no-unresolved
  app = require('../build/server').default;
  appPromiseIsResolved = true;
  appPromiseResolve();

  // Launch the development server with Browsersync and HMR
  await new Promise((resolve, reject) => browserSync.create().init({
    // https://www.browsersync.io/docs/options
    server: 'src/server.js',
    middleware: [server],
    open: !process.argv.includes('--silent'),
    ...isDebug ? {} : { notify: false, ui: false },
  }, (error, bs) => (error ? reject(error) : resolve(bs))));

  const timeEnd = new Date();
  const time = timeEnd.getTime() - timeStart.getTime();
  console.info(`[${format(timeEnd)}] Server launched after ${time} ms`);
  return server;
}

export default start;
