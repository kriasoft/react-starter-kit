/**
 * React Starter Kit (http://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2015 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import path from 'path';
import cp from 'child_process';
import watch from './lib/watch';

/**
 * Launches Node.js/Express web server in a separate (forked) process.
 */
function serve() {
  return new Promise((resolve, reject) => {
    function start() {
      const server = cp.spawn('node', [path.join(__dirname, '../build/server.js')], {
        env: Object.assign({ NODE_ENV: 'development' }, process.env),
        silent: false,
      });

      server.stdout.on('data', data => {
        const message = data.toString();
        if (message.match(' running ')) {
          console.log(message.trim());
          resolve();
        } else {
          console.log(message);
        }
      });

      server.stderr.once('data', data => {
        reject(data.toString());
      });

      server.on('error', err => reject(err));
      process.on('exit', () => server.kill('SIGTERM'));
      return server;
    }

    let server = start();

    if (global.WATCH) {
      watch('build/server.js').then(watcher => {
        watcher.on('changed', () => {
          server.kill('SIGTERM');
          server = start();
        });
      });
    }
  });
}

export default serve;
