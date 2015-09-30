/**
 * React Starter Kit (http://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2015 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import task from './lib/task';

/**
 * Compiles the project from source files into a distributable
 * format and copies it to the output (build) folder.
 */
export default task('build', async () => {
  await require('./clean')();
  await require('./copy')();
  await require('./bundle')();
});

