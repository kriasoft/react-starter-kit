/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import FastClick from 'fastclick';
import UniversalRouter from 'universal-router';
import queryString from 'query-string';
import createBrowserHistory from 'history/createBrowserHistory';
import App from './components/App';
import {
  addEventListener,
  removeEventListener,
  windowScrollX,
  windowScrollY,
} from './core/DOMUtils';

// Global (context) variables that can be easily accessed from any React component
// https://facebook.github.io/react/docs/context.html
const context = {
  // Navigation manager, e.g. history.push('/home')
  // https://github.com/mjackson/history
  history: createBrowserHistory(),
  // Enables critical path CSS rendering
  // https://github.com/kriasoft/isomorphic-style-loader
  insertCss: (...styles) => {
    // eslint-disable-next-line no-underscore-dangle
    const removeCss = styles.map(x => x._insertCss());
    return () => { removeCss.forEach(f => f()); };
  },
};

function updateTag(tag, nameKey, valueKey, name, value) {
  // Remove and create a new <meta /> tag in order to make it work with bookmarks in Safari
  let meta = document.head.querySelector(`${tag}[${nameKey}=${name}]`);
  if (!meta || meta.getAttribute(valueKey) !== value) {
    if (meta) {
      meta.parentNode.removeChild(meta);
    }
    if (typeof value === 'string') {
      meta = document.createElement(tag);
      meta.setAttribute(nameKey, name);
      meta.setAttribute(valueKey, value);
      document.head.appendChild(meta);
    }
  }
}
function updateMeta(name, value) {
  updateTag('meta', 'name', 'content', name, value);
}
function updateLink(name, value) { // eslint-disable-line no-unused-vars
  updateTag('link', 'rel', 'href', name, value);
}
function updateCustomMeta(name, value) { // eslint-disable-line no-unused-vars
  updateTag('meta', 'property', 'content', name, value);
}

// Restore the scroll position if it was saved into the state
let locationStates = {};
function restoreScrollPosition({ key, hash }) {
  let scrollX = 0;
  let scrollY = 0;
  const state = locationStates[key];
  if (state) {
    scrollX = state.scrollX;
    scrollY = state.scrollY;
  } else {
    const targetHash = hash && hash.substr(1);
    if (targetHash) {
      const target = document.getElementById(targetHash);
      if (target) {
        scrollY = windowScrollY() + target.getBoundingClientRect().top;
      }
    }
  }

  window.scrollTo(scrollX, scrollY);
}

let onRenderComplete = function initialRenderComplete() {
  const elem = document.getElementById('css');
  if (elem) elem.parentNode.removeChild(elem);
  onRenderComplete = function renderComplete(route, location) {
    document.title = route.title;

    updateMeta('description', route.description);
    // Update necessary custom tags at runtime here, ie:
    // updateMeta('keywords', route.keywords);
    // updateLink('canonical', route.canonicalUrl);
    // updateCustomMeta('og:url', route.canonicalUrl);
    // updateCustomMeta('og:image', route.imageUrl);
    // etc.

    restoreScrollPosition(location);

    // Google Analytics tracking. Don't send 'pageview' event after
    // the initial rendering, as it was already sent
    if (window.ga) {
      window.ga('send', 'pageview', location.pathname + location.search);
    }
  };
};

const container = document.getElementById('app');
function render(route, location) {
  return new Promise((resolve, reject) => {
    try {
      ReactDOM.render(
        <App context={context}>{route.component}</App>,
        container,
        onRenderComplete.bind(undefined, route, location)
      );
    } catch (err) {
      reject(err);
    }
  });
}

// Make taps on links and buttons work fast on mobiles
FastClick.attach(document.body);

let currentLocation = context.history.location;
let routes = require('./routes').default;

// Re-render the app when window.location changes
async function onLocationChange(location) {
  // Save the page scroll position into the current location's state
  locationStates[currentLocation.key] = {
    scrollX: windowScrollX(),
    scrollY: windowScrollY(),
  };
  if (history.action === 'PUSH') {
    delete locationStates[location.key];
  }
  currentLocation = location;

  try {
    const route = await UniversalRouter.resolve(routes, {
      path: location.pathname,
      query: queryString.parse(location.search),
      state: location.state,
    });

    await render(route, location);
  } catch (err) {
    // TODO: Inform the user about the failed page transition.
    console.error(err); // eslint-disable-line no-console
  }
}

// Add History API listener and trigger initial change
const removeHistoryListener = context.history.listen(onLocationChange);
onLocationChange(currentLocation);

// Switch off the native scroll restoration behavior and handle it manually
// https://developers.google.com/web/updates/2015/09/history-api-scroll-restoration
let originalScrollRestoration;
if (window.history && 'scrollRestoration' in window.history) {
  originalScrollRestoration = window.history.scrollRestoration;
  window.history.scrollRestoration = 'manual';
}

// Prevent listeners collisions during history navigation
addEventListener(window, 'pagehide', function onPageHide() {
  removeEventListener(window, 'pagehide', onPageHide);
  removeHistoryListener();
  locationStates = {};
  if (originalScrollRestoration) {
    window.history.scrollRestoration = originalScrollRestoration;
    originalScrollRestoration = undefined;
  }
});

// Enable Hot Module Replacement (HMR)
if (module.hot) {
  module.hot.accept('./routes', () => {
    routes = require('./routes').default; // eslint-disable-line global-require

    onLocationChange(context.history.location);
  });
}
