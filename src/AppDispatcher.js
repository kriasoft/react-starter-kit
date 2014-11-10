/*
 * A singleton that operates as the central hub for application updates.
 * For more information visit https://facebook.github.io/flux/
 */

'use strict';

var {Dispatcher} = require('flux');
var PayloadSources = require('./constants/PayloadSources');
var assign = require('object-assign');

var AppDispatcher = assign(new Dispatcher(), {

  /**
   * @param {object} action The details of the action, including the action's
   * type and additional data coming from the server.
   */
  handleServerAction(action) {
    var payload = {
      source: PayloadSources.SERVER_ACTION,
      action
    };
    this.dispatch(payload);
  },

  /**
   * @param {object} action The details of the action, including the action's
   * type and additional data coming from the view.
   */
  handleViewAction(action) {
    var payload = {
      source: PayloadSources.VIEW_ACTION,
      action
    };
    this.dispatch(payload);
  }

});

module.exports = AppDispatcher;
