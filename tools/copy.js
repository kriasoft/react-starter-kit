/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import path from 'path';
import chokidar from 'chokidar';
import { writeFile, copyFile, makeDir, copyDir, cleanDir } from './lib/fs';
import pkg from '../package.json';

/**
 * Copies static files such as robots.txt, favicon.ico to the
 * output (build) folder.
 */
async function copy() {
  await makeDir('build');
  await Promise.all([
    writeFile('build/package.json', JSON.stringify({
      private: true,
      engines: pkg.engines,
      dependencies: pkg.dependencies,
      scripts: {
        start: 'node server.js',
      },
    }, null, 2)),
    copyFile('LICENSE.txt', 'build/LICENSE.txt'),
    copyDir('src/content', 'build/content'),
    copyDir('public', 'build/public'),
  ]);

  if (process.argv.includes('--watch')) {
    const watcher = chokidar.watch([
      'src/content/**/*',
      'public/**/*',
    ]);

    watcher.on('all', async (event, filePath) => {
      const src = path.relative('./', filePath);
      const dist = path.join('build/', src.startsWith('src') ? path.relative('src', src) : src);
      switch (event) {
        case 'add':
        case 'change':
          if (filePath.endsWith('/')) return;
          await makeDir(path.dirname(dist));
          await copyFile(filePath, dist);
          break;
        case 'unlink':
          cleanDir(dist, { nosort: true, dot: true });
          break;
        default:
          return;
      }
      console.log(`[file ${event}] ${dist}`);
    });
  }
}

export default copy;
