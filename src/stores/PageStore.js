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
var Settings = require('../constants/Settings');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');

var CHANGE_EVENT = 'change';

var page = {
  title: null,
  description: null,
  keywords: null
};

var PageStore = assign({}, EventEmitter.prototype, {

  /**
   * Get metadata associated with the current page.
   * @returns {object}
   */
  getCurrentPage() {
    return {
      title: page.title || Settings.title,
      description: page.description || Settings.description,
      keywords: page.keywords || Settings.keywords
    };
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

  switch (action.actionType)
  {
    case ActionTypes.SET_PAGE_TITLE:
      page.title = action.text;
      break;

    case ActionTypes.SET_PAGE_DESC:
      page.description = action.description;
      break;

    case ActionTypes.SET_PAGE_KEYWORDS:
      page.keywords = action.keywords;
      break;

    default:
      return true;
  }

  PageStore.emitChange();

  return true; // No errors.  Needed by promise in Dispatcher.
});

module.exports = PageStore;
