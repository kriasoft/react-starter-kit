/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import 'babel-polyfill';
import ReactDOM from 'react-dom';
import FastClick from 'fastclick';
import { match } from 'universal-router';
import routes from './routes';
import Location from './core/Location';
import { addEventListener, removeEventListener } from './core/DOMUtils';

const container = document.getElementById('app');
const context = {
  insertCss: styles => styles._insertCss(),
  setTitle: value => (document.title = value),
  setMeta: (name, content) => {
    // Remove and create a new <meta /> tag in order to make it work
    // with bookmarks in Safari
    const elements = document.getElementsByTagName('meta');
    Array.from(elements).forEach((element) => {
      if (element.getAttribute('name') === name) {
        element.parentNode.removeChild(element);
      }
    });
    const meta = document.createElement('meta');
    meta.setAttribute('name', name);
    meta.setAttribute('content', content);
    document
      .getElementsByTagName('head')[0]
      .appendChild(meta);
  },
};

// Restore the scroll position if it was saved into the state
function restoreScrollPosition(state) {
  if (state && state.scrollY !== undefined) {
    window.scrollTo(state.scrollX, state.scrollY);
  } else {
    window.scrollTo(0, 0);
  }
}

let renderComplete = (state, callback) => {
  restoreScrollPosition(state);
  const elem = document.getElementById('css');
  if (elem) elem.parentNode.removeChild(elem);
  callback(true);
  renderComplete = (s) => {
    restoreScrollPosition(s);

    // Google Analytics tracking. Don't send 'pageview' event after
    // the initial rendering, as it was already sent
    window.ga('send', 'pageview');

    callback(true);
  };
};

function render(state, component) {
  return new Promise((resolve, reject) => {
    try {
      ReactDOM.render(
        component,
        container,
        renderComplete.bind(undefined, state, resolve)
      );
    } catch (err) {
      reject(err);
    }
  });
}

function run() {
  let currentLocation = null;

  // Make taps on links and buttons work fast on mobiles
  FastClick.attach(document.body);

  // Re-render the app when window.location changes
  const removeLocationListener = Location.listen(location => {
    currentLocation = location;
    match(routes, {
      path: location.pathname,
      query: location.query,
      state: location.state,
      context,
      render: render.bind(undefined, location.state),
    }).catch(err => console.error(err)); // eslint-disable-line no-console
  });

  // Save the page scroll position into the current location's state
  const supportPageOffset = window.pageXOffset !== undefined;
  const isCSS1Compat = ((document.compatMode || '') === 'CSS1Compat');
  const setPageOffset = () => {
    currentLocation.state = currentLocation.state || Object.create(null);
    if (supportPageOffset) {
      currentLocation.state.scrollX = window.pageXOffset;
      currentLocation.state.scrollY = window.pageYOffset;
    } else {
      currentLocation.state.scrollX = isCSS1Compat ?
        document.documentElement.scrollLeft : document.body.scrollLeft;
      currentLocation.state.scrollY = isCSS1Compat ?
        document.documentElement.scrollTop : document.body.scrollTop;
    }
  };

  addEventListener(window, 'scroll', setPageOffset);
  addEventListener(window, 'pagehide', () => {
    removeEventListener(window, 'scroll', setPageOffset);
    removeLocationListener();
  });
}

// Run the application when both DOM is ready and page content is loaded
if (['complete', 'loaded', 'interactive'].includes(document.readyState) && document.body) {
  run();
} else {
  document.addEventListener('DOMContentLoaded', run, false);
}
