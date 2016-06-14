/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import run from './run';
import compileClient from './compileClient';
import compileServer from './compileServer';

function compile() {
  return Promise.all([
    run(compileClient),
    run(compileServer),
  ]);
}

export default compile;
