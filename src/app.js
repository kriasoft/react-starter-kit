/*! React Starter Kit | MIT License | http://www.reactstarterkit.com/ */

import 'babel/polyfill';
import React from 'react';
import FastClick from 'fastclick';
import App from './components/App';
import Dispatcher from './core/Dispatcher';
import AppActions from './actions/AppActions';
import ActionTypes from './constants/ActionTypes';

let path = decodeURI(window.location.pathname);
let onSetMeta = (name, content) => {
  // Remove and create a new <meta /> tag in order to make it work
  // with bookmarks in Safari
  let elements = document.getElementsByTagName('meta');
  [].slice.call(elements).forEach((element) => {
    if (element.getAttribute('name') === name) {
      element.parentNode.removeChild(element);
    }
  });
  let meta = document.createElement('meta');
  meta.setAttribute('name', name);
  meta.setAttribute('content', content);
  document.getElementsByTagName('head')[0].appendChild(meta);
};

function run() {
  // Render the top-level React component
  let props = {
    path: path,
    context: {
      onSetTitle: value => document.title = value,
      onSetMeta
    }
  };
  let element = React.createElement(App, props);
  React.render(element, document.getElementById('app'), () => {
    let css = document.getElementById('css');
    css.parentNode.removeChild(css);
  });

  // Update `Application.path` prop when `window.location` is changed
  Dispatcher.register((action) => {
    if (action.type === ActionTypes.CHANGE_LOCATION) {
      element = React.cloneElement(element, {path: action.path});
      React.render(element, document.getElementById('app'));
    }
  });
}

// Run the application when both DOM is ready
// and page content is loaded
Promise.all([
  new Promise((resolve) => {
    if (window.addEventListener) {
      window.addEventListener('DOMContentLoaded', resolve);
    } else {
      window.attachEvent('onload', resolve);
    }
  }).then(() => FastClick.attach(document.body)),
  new Promise((resolve) => AppActions.loadPage(path, resolve))
]).then(run);
