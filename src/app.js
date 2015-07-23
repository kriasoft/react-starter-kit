/*! React Starter Kit | MIT License | http://www.reactstarterkit.com/ */

import 'babel/polyfill';
import ReactDOM from 'react-dom';
import FastClick from 'fastclick';
import router from './router';
import Dispatcher from './core/Dispatcher';
import Location from './core/Location';
import ActionTypes from './constants/ActionTypes';

const container = document.getElementById('app');
const context = {
  onSetTitle: value => document.title = value,
  onSetMeta: (name, content) => {
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
  }
};

function run() {
  router.dispatch({ path: window.location.pathname, context }, (state, component) => {
    ReactDOM.render(component, container, () => {
      let css = document.getElementById('css');
      css.parentNode.removeChild(css);
    });
  });

  Dispatcher.register(action => {
    if (action.type === ActionTypes.CHANGE_LOCATION) {
      router.dispatch({ path: action.path, context }, (state, component) => {
        ReactDOM.render(component, container);
      });
    }
  });
}

function handlePopState(event) {
  Location.navigateTo(window.location.pathname, { replace: !!event.state });
}

// Run the application when both DOM is ready
// and page content is loaded
new Promise(resolve => {
  if (window.addEventListener) {
    window.addEventListener('DOMContentLoaded', resolve);
    window.addEventListener('popstate', handlePopState);
  } else {
    window.attachEvent('onload', resolve);
    window.attachEvent('popstate', handlePopState);
  }
}).then(() => FastClick.attach(document.body)).then(run);
