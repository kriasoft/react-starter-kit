/**
 * React Starter Kit (http://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2015 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import fs from 'fs';
import mkdirp from 'mkdirp';

const writeFile = (filename, contents) => new Promise((resolve, reject) => {
  fs.writeFile(filename, contents, 'utf8', err => {
    if (err) {
      reject(err);
    } else {
      resolve();
    }
  });
});

const makeDir = name => new Promise((resolve, reject) => {
  mkdirp(name, err => {
    if (err) {
      reject(err);
    } else {
      resolve();
    }
  });
});

export default { writeFile, makeDir };
