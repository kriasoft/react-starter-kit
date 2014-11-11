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

var PageActions = {

  /**
   * Set a title for the current page.
   * @param {string} text The text to be set as a page title.
   */
  setTitle(text) {
    AppDispatcher.handleViewAction({
      actionType: ActionTypes.SET_PAGE_TITLE,
      text: text
    });
  },

  /**
   * Set description for the current page.
   * @param {string} text The text to be set as a page description.
   */
  setDescription(text) {
    AppDispatcher.handleViewAction({
      actionType: ActionTypes.SET_PAGE_DESC,
      text: text
    });
  },

  /**
   * Set keywords for the current page.
   * @param {string} text The text to be set as page keywords.
   */
  setKeywords(text) {
    AppDispatcher.handleViewAction({
      actionType: ActionTypes.SET_PAGE_KEYWORDS,
      text: text
    });
  }

};

module.exports = PageActions;
