/*
 * React.js Starter Kit
 * Copyright (c) 2014 Konstantin Tarkus (@koistya), KriaSoft LLC.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

'use strict';

require('babel/register');

var noop = function(module, file) {
  module._compile('', file);
};

require.extensions['.css'] = noop;
require.extensions['.gif'] = noop;
require.extensions['.jpg'] = noop;
require.extensions['.less'] = noop;
require.extensions['.png'] = noop;
require.extensions['.svg'] = noop;
