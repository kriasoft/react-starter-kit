/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import webpackConfig from './webpack.config';
import runWebpack from './lib/runWebpack';

/**
 * Creates application bundles from the source files.
 */
export default function bundle() {
  return runWebpack(webpackConfig, webpackConfig[0].stats);
}
