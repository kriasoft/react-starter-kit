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
export default async () => {
  console.log('clean');
  await del(['.tmp', 'build/*', '!build/.git'], {dot: true});
  await fs.makeDir('build/public');
};
