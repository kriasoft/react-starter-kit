/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

/* eslint-disable global-require */

if (module.hot || process.env.NODE_ENV !== 'production') {
  module.exports = {
    // The red box (aka red screen of death) component to display your errors
    // https://github.com/commissure/redbox-react
    ErrorReporter: require('redbox-react').default,

    // Force-updates React component tree recursively
    // https://github.com/gaearon/react-deep-force-update
    deepForceUpdate: require('react-deep-force-update'),
  };
}
