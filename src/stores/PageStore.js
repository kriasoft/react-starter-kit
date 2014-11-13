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
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');

var CHANGE_EVENT = 'change';

/**
 * @typedef Page
 * @type {object}
 * @property {string} title
 * @property {string} description
 * @property {string} keywords
 */

/** @type {Page} */
var _page;

var PageStore = assign({}, EventEmitter.prototype, {

  /**
   * Get the current page.
   * @returns {Page}
   */
  get() {
    return _page || require('../constants/Settings').defaults.page;
  },

  emitChange() {
    this.emit(CHANGE_EVENT);
  },

  addEventListener(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  removeEventListener(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  }

});


AppDispatcher.register(function(payload) {

  var action = payload.action;

  if (action.actionType == ActionTypes.SET_CURRENT_PAGE) {
    _page = action.page;
    PageStore.emitChange();
  }

  return true; // No errors.  Needed by promise in Dispatcher.
});

module.exports = PageStore;
