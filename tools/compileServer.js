/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import path from 'path';
const babel = require('babel-core');
import { readFile, writeFile, copyFile, readDir, makeDir } from './lib/fs';

/**
 * Compile server-side application from the source files.
 */
async function compileServer() {
  const dirs = await readDir('**/*.{js,json,md}', {
    cwd: 'src',
    nosort: true,
    dot: false,
    ignore: [
      'client.js',
      'public/*',
      '**/*.client.js',
      '**/*.test.js',
    ],
  });

  await Promise.all(dirs.map(async dir => {
    const from = path.resolve('src', dir);
    const to = path.resolve('build', dir);
    const ext = path.extname(dir);
    await makeDir(path.dirname(to));
    if (ext === '.js') {
      const file = await readFile(from);
      const result = babel.transform(file, {
        filename: dir,
        filenameRelative: from,
        sourceMaps: 'inline',
      });
      return await writeFile(to, result.code);
    }
    return await copyFile(from, to);
  }));
}

export default compileServer;
