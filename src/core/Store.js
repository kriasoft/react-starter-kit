/*
 * React.js Starter Kit
 * Copyright (c) 2014 Konstantin Tarkus (@koistya), KriaSoft LLC.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

'use strict';

var EventEmitter = require('events').EventEmitter;
var assign = require('react/lib/Object.assign');
var invariant = require('react/lib/invariant');

var CHANGE_EVENT = 'change';

/**
 * The Flux store base class.
 */
class Store {

  /**
   * Constructs a Store object, extends it with EventEmitter and supplied
   * methods parameter,  and creates a mixin property for use in components.
   *
   * @param {object} methods Public methods for Store instance.
   * @constructor
   */
  constructor(methods) {

    var self = this;

    invariant(!methods.dispatcherToken,'"dispatcherToken" is a reserved name and cannot be used as a method name.');
    invariant(!methods.Mixin,'"Mixin" is a reserved name and cannot be used as a method name.');

    assign(this, EventEmitter.prototype, methods);

    this.dispatcherToken = null;

    /**
     * Base functionality for every Store constructor. Mixed into the
     * `Store` prototype, but exposed statically for easy access.
     */
    this.Mixin = {

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
