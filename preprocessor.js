/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

'use strict';

var babel = require('babel-core');

module.exports = {
  process: function(src, filename) {
    // Ignore files other than .js, .es, .jsx or .es6
    if (!babel.canCompile(filename)) {
      return '';
    }
    // Ignore all files within node_modules
    if (filename.indexOf('node_modules') === -1) {
      return babel.transform(src, {filename: filename}).code;
    }
    return src;
  }
};
