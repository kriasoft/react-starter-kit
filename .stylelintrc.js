/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

// stylelint configuration
// https://stylelint.io/user-guide/configuration/
module.exports = {

  // The standard config based on a handful of CSS style guides
  // https://github.com/stylelint/stylelint-config-standard
  extends: 'stylelint-config-standard',

  rules: {
    'property-no-unknown': [true, {
      ignoreProperties: [
        // CSS Modules composition
        // https://github.com/css-modules/css-modules#composition
        'composes'
      ]
    }],

    'selector-pseudo-class-no-unknown': [true, {
      ignorePseudoClasses: [
        // CSS Modules :global scope
        // https://github.com/css-modules/css-modules#exceptions
        'global'
      ]
    }],

    // Opinionated rule, you can disable it if you want
    'string-quotes': 'single',
  },
};
