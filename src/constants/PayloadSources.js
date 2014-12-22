/*
 * React.js Starter Kit
 * Copyright (c) 2014 Konstantin Tarkus (@koistya), KriaSoft LLC.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

'use strict';

var keyMirror = require('react/lib/keyMirror');

var PayloadSources = keyMirror({

  VIEW_ACTION: null,
  SERVER_ACTION: null

});

module.exports = PayloadSources;
