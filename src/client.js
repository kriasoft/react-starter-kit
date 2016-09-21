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
import UniversalRouter from 'universal-router';
import createBrowserHistory from 'history/createBrowserHistory';
import { parse as parseQueryString } from 'query-string';
import {
  addEventListener,
  removeEventListener,
  windowScrollX,
  windowScrollY,
} from './core/DOMUtils';

const history = createBrowserHistory();
const context = {
  history,
  insertCss: (...styles) => {
    const removeCss = styles.map(style => style._insertCss()); // eslint-disable-line no-underscore-dangle, max-len
    return () => {
      removeCss.forEach(f => f());
    };
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
function updateMeta(name, content) {
  updateTag('meta', 'name', 'content', name, content);
}
function updateLink(rel, href) { // eslint-disable-line no-unused-vars
  updateTag('link', 'rel', 'href', rel, href);
}
function updateCustomMeta(property, content) { // eslint-disable-line no-unused-vars
  updateTag('meta', 'property', 'content', property, content);
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
        route.component,
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

let currentLocation = history.location;
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
      query: parseQueryString(location.search),
      state: location.state,
      context,
    });

    await render(route, location);
  } catch (err) {
    if (process.env.NODE_ENV !== 'production') {
      throw err;
    }
    console.error(err); // eslint-disable-line no-console
  }
}

// Add History API listener and trigger initial change
const removeHistoryListener = history.listen(onLocationChange);
history.replace(currentLocation);

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

    onLocationChange(history.location);
  });
}
