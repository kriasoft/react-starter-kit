'use strict';

var AppDispatcher = require('../AppDispatcher');
var ActionTypes = require('../constants/ActionTypes');

var AppActions = {

  /**
   * Set the current route.
   * @param {string} route Supply a route value, such as `todos/completed`.
   */
  setRoute(route) {
    AppDispatcher.handleViewAction({
      actionType: ActionTypes.SET_CURRENT_ROUTE,
      route
    });
  }

};

module.exports = AppActions;
