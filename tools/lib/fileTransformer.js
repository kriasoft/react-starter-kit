/**
 * React Starter Kit (https://reactstarter.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

const path = require('path');

// This is a custom Jest transformer turning file imports into filenames.
// https://facebook.github.io/jest/docs/en/webpack.html
module.exports = {
  process(src, filename) {
    return `module.exports = ${JSON.stringify(path.basename(filename))};`;
  },
};
