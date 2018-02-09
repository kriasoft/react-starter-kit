/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

/* eslint-disable global-require */

const pkg = require('../package.json');

module.exports = () => ({
  // The list of plugins for PostCSS
  // https://github.com/postcss/postcss
  plugins: [
    // Transfer @import rule by inlining content, e.g. @import 'normalize.css'
    // https://github.com/postcss/postcss-import
    require('postcss-import')(),
    // Postcss flexbox bug fixer
    // https://github.com/luisrudge/postcss-flexbugs-fixes
    require('postcss-flexbugs-fixes')(),
    // Postcss vmax fixer
    // https://github.com/jonathantneal/postcss-vmax
    require('postcss-vmax'),
    // Postcss object fit image fixer
    // https://github.com/ronik-design/postcss-object-fit-images
    require('postcss-object-fit-images'),
    // Postcss cssnext
    // http://cssnext.io/
    require('postcss-cssnext')({
      browsers: pkg.browserslist,
    }),
  ],
});
