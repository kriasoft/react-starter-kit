/*
 * React.js Starter Kit
 * Copyright (c) 2014 Konstantin Tarkus (@koistya), KriaSoft LLC.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

'use strict';

var Store = require('../core/Store');
var Dispatcher = require('../core/Dispatcher');
var ActionTypes = require('../constants/ActionTypes');

/**
 * @typedef Page
 * @type {object}
 * @property {string} title
 * @property {string} description
 * @property {string} keywords
 */
var _page;

var PageStore = new Store({

  /**
   * Gets metadata associated with the current page.
   * @returns {Page}
   */
  get() {
    return _page || require('../constants/Settings').defaults.page;
  }

});

PageStore.dispatcherToken = Dispatcher.register(payload => {

  var action = payload.action;

  if (action.actionType == ActionTypes.SET_CURRENT_PAGE) {
    _page = action.page;
    PageStore.emitChange();
  }

  return true; // No errors.  Needed by promise in Dispatcher.

});

module.exports = PageStore;
