'use strict';

var React = require('react');
var {Router} = require('director');
var AppDispatcher = require('./AppDispatcher');
var ActionTypes = require('./constants/ActionTypes');

// Export React so the dev tools can find it
(window !== window.top ? window.top : window).React = React;

function render(component) {
  React.renderComponent(component(), document.body);
}

var routes = {
  '/': () => render(require('./pages/Home.jsx')),
  '/privacy': () => render(require('./pages/Privacy.jsx'))
};

var router = new Router(routes).configure({html5history: true}).init();

AppDispatcher.register(function(payload) {

  var action = payload.action;

  switch (action.actionType) {
    case ActionTypes.SET_CURRENT_ROUTE:
      router.setRoute(action.route);
      break;
  }

  return true; // No errors.  Needed by promise in Dispatcher.
});
