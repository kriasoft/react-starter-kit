/*
 * React.js Starter Kit
 * Copyright (c) 2014 Konstantin Tarkus (@koistya), KriaSoft LLC.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

'use strict';

import Dispatcher from '../core/Dispatcher';
import ActionTypes from '../constants/ActionTypes';
import PayloadSources from '../constants/PayloadSources';
import EventEmitter from 'eventemitter3';
import assign from 'react/lib/Object.assign';

var CHANGE_EVENT = 'change';

var _pages = {};
var _loading = false;

if (__SERVER__) {
  _pages['/'] = {title: 'Home Page'};
  _pages['/privacy'] = {title: 'Privacy Policy'};
}

var AppStore = assign({}, EventEmitter.prototype, {

  /**
   * Gets page data by the given URL path.
   *
   * @param {String} path URL path.
   * @returns {*} Page data.
   */
  getPage(path) {
    return path in _pages ? _pages[path] : {
      title: 'Page Not Found',
      type: 'notfound'
    };
  },

  /**
   * Emits change event to all registered event listeners.
   *
   * @returns {Boolean} Indication if we've emitted an event.
   */
  emitChange() {
    return this.emit(CHANGE_EVENT);
  },

  /**
   * Register a new change event listener.
   *
   * @param {function} callback Callback function.
   */
  onChange(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  /**
   * Remove change event listener.
   *
   * @param {function} callback Callback function.
   */
  off(callback) {
    this.off(CHANGE_EVENT, callback);
  }

});

AppStore.dispatcherToken = Dispatcher.register((payload) => {
  var action = payload.action;

  switch (action.actionType) {

    case ActionTypes.LOAD_PAGE:
      if (action.source === PayloadSources.VIEW_ACTION) {
        _loading = true;
      } else {
        if (!action.err) {
          _pages[action.path] = action.page;
        }
      }
      AppStore.emitChange();
      break;

    default:
      // Do nothing

  }

});

module.exports = AppStore;

