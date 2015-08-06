/**
 * React Starter Kit (http://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2015 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import del from 'del';
import fs from './lib/fs';

/**
 * Cleans up the output (build) directory.
 */
export default () => new Promise((resolve, reject) => {
  console.log('clean');
  del(['.tmp', 'build/*', '!build/.git'], {dot: true}, err => {
    if (err) {
      reject(err);
    } else {
      fs.makeDir('build/public').then(resolve, reject);
    }
  });
});
