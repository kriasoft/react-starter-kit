/*
 * React.js Starter Kit
 * Copyright (c) 2014 Konstantin Tarkus (@koistya), KriaSoft LLC.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

'use strict';

var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var invariant = require('react/lib/invariant');

var CHANGE_EVENT = 'change';

class Store {

  constructor(methods) {

    var self = this;

    invariant(!methods.dispatcherToken,'"dispatcherToken" is a reserved name and cannot be used as a method name.');
    invariant(!methods.mixin,'"mixin" is a reserved name and cannot be used as a method name.');

    assign(this, EventEmitter.prototype, methods);

    this.dispatcherToken = null;
    this.mixin = {

      componentDidMount: function() {
        self.addChangeListener(this.onChange);
      },

      componentWillUnmount: function() {
        self.removeChangeListener(this.onChange);
      }

    };
  }

  /**
   * Emits change event.
   */
  emitChange() {
    this.emit(CHANGE_EVENT);
  }

  /**
   * Adds a change listener.
   *
   * @param {function} callback Callback function.
   */
  addChangeListener(callback) {
    this.on(CHANGE_EVENT, callback);
  }

  /**
   * Removes a change listener.
   *
   * @param {function} callback Callback function.
   */
  removeChangeListener(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  }

}

module.exports = Store;
