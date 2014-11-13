/*
 * React.js Starter Kit
 * Copyright (c) 2014 Konstantin Tarkus (@koistya), KriaSoft LLC.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

'use strict';

var AppDispatcher = require('../AppDispatcher');
var ActionTypes = require('../constants/ActionTypes');

module.exports = {

  /**
   * Set the current route.
   * @param {string} route Supply a route value, such as `todos/completed`.
   */
  setRoute(route) {
    AppDispatcher.handleViewAction({
      actionType: ActionTypes.SET_CURRENT_ROUTE,
      route: route
    });
  }

};
