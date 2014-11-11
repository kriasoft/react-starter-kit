/*
 * React.js Starter Kit
 * Copyright (c) 2014 Konstantin Tarkus (@koistya), KriaSoft LLC.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

'use strict';

var React = require('react');
var ExecutionEnvironment = require('react/lib/ExecutionEnvironment');
var {Router} = require('director');
var AppDispatcher = require('./AppDispatcher');
var ActionTypes = require('./constants/ActionTypes');
var router;

// Export React so the dev tools can find it
(window !== window.top ? window.top : window).React = React;

AppDispatcher.register((payload) => {

  var action = payload.action;

  switch (action.actionType)
  {
    case ActionTypes.SET_CURRENT_ROUTE:
      router.setRoute(action.route);
      break;

    case ActionTypes.SET_PAGE_TITLE:
      if (ExecutionEnvironment.canUseDOM) {
        document.title = action.text;
      }
      break;
  }

  return true; // No errors.  Needed by promise in Dispatcher.
});

/**
 * Check if Page component has a layout property; and if yes, wrap the page
 * into the specified layout, then mount to document.body.
 */
function render(page) {
  var layout = null, child = null, props = {};
  while ((layout = page.type.layout || (page.defaultProps && page.defaultProps.layout))) {
    child = React.createElement(page, props, child);
    page = layout;
  }
  React.render(React.createElement(page, props, child), document.body);
}

// Define URL routes
// See https://github.com/flatiron/director
var routes = {
  '/': () => render(require('./pages/Index')),
  '/privacy': () => render(require('./pages/Privacy'))
};

// Initialize a router
router = new Router(routes).configure({html5history: true}).init();
