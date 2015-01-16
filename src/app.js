/*
 * React.js Starter Kit
 * Copyright (c) 2014 Konstantin Tarkus (@koistya), KriaSoft LLC.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

'use strict';

var React = require('react');
var App = require('./components/App');
var Dispatcher = require('./core/Dispatcher');
var AppActions = require('./actions/AppActions');
var ActionTypes = require('./constants/ActionTypes');

// Export React so the dev tools can find it
(window !== window.top ? window.top : window).React = React;

// Initial properties and callbacks
// which should be passed into the top-level React component (App)
var props = {
  path: decodeURI(window.location.pathname),
  onSetTitle: (title) => {
    document.title = title;
  },
  onSetMeta: (name, content) => {
    // Remove and create a new <meta /> tag in order to make it work
    // with bookmarks in Safari
    var elements = document.getElementsByTagName('meta');
    [].slice.call(elements).forEach((element) => {
      if (element.getAttribute('name') === name) {
        element.parentNode.removeChild(element);
      }
    });
    var meta = document.createElement('meta');
    meta.setAttribute('name', name);
    meta.setAttribute('content', content);
    document.getElementsByTagName('head')[0].appendChild(meta);
  },
  onPageNotFound: () => { /* do nothing */ }
};

// Render application when DOM is ready
function startup() {
  // Render the top-level React component and mount it to the `document.body`
  var app = React.render(React.createElement(App, props), document.body);

  // Set Application.path property when `window.location` is changed
  Dispatcher.register((payload) => {
    if (payload.action.actionType === ActionTypes.CHANGE_LOCATION) {
      app.setProps({path: decodeURI(payload.action.path)});
    }
  });
}

// Load page content
AppActions.loadPage(props.path, () => {
  if (window.addEventListener) {
    window.addEventListener('DOMContentLoaded', startup, false);
  } else {
    window.attachEvent('onload', startup);
  }
});
