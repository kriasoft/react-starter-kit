/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import rimraf from 'rimraf';

/**
 * Cleans up the output (build) directory.
 */
function clean() {
  rimraf.sync('build/*', {
    glob: { nosort: true, dot: true, ignore: ['build/.git', 'build/public'] }
  });
  rimraf.sync('build/public/*', {
    glob: { nosort: true, dot: true, ignore: ['build/public/.git'] }
  });
}

export default clean;
