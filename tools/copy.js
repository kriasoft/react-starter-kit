/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import path from 'path';
import gaze from 'gaze';
import Promise from 'bluebird';
import fs from './lib/fs';
import pkg from '../package.json';
/**
 * Copies static files such as robots.txt, favicon.ico to the
 * output (build) folder.
 */
async function copy({ watch } = {}) {
  const ncp = Promise.promisify(require('ncp'));

  await Promise.all([
    ncp('src/public', 'build/public'),
    ncp('src/content', 'build/content'),
  ]);

  await fs.writeFile('./build/package.json', JSON.stringify({
    private: true,
    engines: pkg.engines,
    dependencies: pkg.dependencies,
    scripts: {
      start: 'node server.js',
    },
  }, null, 2));

  if (watch) {
    const watcher = await new Promise((resolve, reject) => {
      gaze('src/content/**/*.*', (err, val) => err ? reject(err) : resolve(val));
    });
    watcher.on('changed', async (file) => {
      const relPath = file.substr(path.join(__dirname, '../src/content/').length);
      await ncp(`src/content/${relPath}`, `build/content/${relPath}`);
    });
  }
}

export default copy;
