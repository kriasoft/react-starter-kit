/**
 * React Starter Kit (http://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2015 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import ncp from 'ncp';

export default (source, dest) => new Promise((resolve, reject) => {
  ncp(source, dest, err => err ? reject(err) : resolve());
});
