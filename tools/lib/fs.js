/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import fs from 'fs';
import mkdirp from 'mkdirp';
import globPkg from 'glob';

const readFile = (file) => new Promise((resolve, reject) => {
  fs.readFile(file, 'utf8', (err, content) => err ? reject(err) : resolve(content));
});

const writeFile = (file, contents) => new Promise((resolve, reject) => {
  fs.writeFile(file, contents, 'utf8', err => err ? reject(err) : resolve());
});

const makeDir = (name) => new Promise((resolve, reject) => {
  mkdirp(name, err => err ? reject(err) : resolve());
});

const glob = (pattern) => new Promise((resolve, reject) => {
  globPkg(pattern, (err, val) => err ? reject(err) : resolve(val));
});

export default { readFile, writeFile, makeDir, glob };
