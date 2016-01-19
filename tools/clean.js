/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import del from 'del';
import fs from './lib/fs';

/**
 * Cleans up the output (build) directory.
 */
async function clean() {
  await del(['.tmp', 'build/*', '!build/.git'], { dot: true });
  await fs.makeDir('build/public');
}

export default clean;
