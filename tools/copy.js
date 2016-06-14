/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import path from 'path';
import { writeFile, copyFile, readDir, makeDir } from './lib/fs';
import pkg from '../package.json';

/**
 * Copies static files such as robots.txt, favicon.ico to the
 * output (build) folder.
 */
function copy() {
  return Promise.all([
    makeDir('build').then(() =>
      writeFile('build/package.json', JSON.stringify({
        private: true,
        engines: pkg.engines,
        dependencies: pkg.dependencies,
        scripts: {
          start: 'node server.js',
        },
      }, null, 2))
    ),

    readDir('**/*.*', {
      cwd: 'src/public',
      nosort: true,
      dot: true,
    }).then(dirs =>
      Promise.all(dirs.map(async dir => {
        const from = path.resolve('src/public', dir);
        const to = path.resolve('build/public', dir);
        await makeDir(path.dirname(to));
        return await copyFile(from, to);
      }))
    ),
  ]);
}

export default copy;
