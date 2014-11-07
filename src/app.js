/*!
 * Facebook React Starter Kit | https://github.com/kriasoft/react-starter-kit
 * Copyright (c) KriaSoft, LLC. All rights reserved. See LICENSE.txt
 */

'use strict';

var _ = require('lodash');
var React = require('react');
var {Router} = require('director');
var AppDispatcher = require('./AppDispatcher');
var ActionTypes = require('./constants/ActionTypes');

// Export React so the dev tools can find it
(window !== window.top ? window.top : window).React = React;

/**
 * Check if Page component has a layout property; and if yes, wrap the page
 * into the specified layout, then mount to document.body.
 */
function render(page) {
  var child = null, props = {};
  while (page.defaultProps && page.defaultProps.layout) {
    child = React.createElement(page, props, child);
    _.extend(props, page.defaultProps);
    page = page.defaultProps.layout;
  }
  React.render(React.createElement(page, props, child), document.body);
  document.title = props.title;
}

// Define URL routes
// See https://github.com/flatiron/director
var routes = {
  '/': () => render(require('./pages/Index')),
  '/privacy': () => render(require('./pages/Privacy'))
};

// Initialize a router
var router = new Router(routes).configure({html5history: true}).init();

AppDispatcher.register((payload) => {

  var action = payload.action;

  if (action.actionType === ActionTypes.SET_CURRENT_ROUTE) {
      router.setRoute(action.route);
  }

  return true; // No errors.  Needed by promise in Dispatcher.
});
