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
import { match, Router } from 'react-router';
import { render } from 'react-dom';
import FastClick from 'fastclick';
import routes from './routes';
import Location from './core/Location';
import ContextHolder from './core/ContextHolder';
import { addEventListener, removeEventListener } from './core/DOMUtils';

let cssContainer = document.getElementById('css');
const appContainer = document.getElementById('app');
const context = {
  insertCss: styles => styles._insertCss(),
  onSetTitle: value => (document.title = value),
  onSetMeta: (name, content) => {
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

// Google Analytics tracking. Don't send 'pageview' event after the first
// rendering, as it was already sent by the Html component.
let trackPageview = () => (trackPageview = () => window.ga('send', 'pageview'));

function run() {
  const scrollOffsets = new Map();
  let currentScrollOffset = null;

  // Make taps on links and buttons work fast on mobiles
  FastClick.attach(document.body);

  const unlisten = Location.listen(location => {
    const locationId = location.pathname + location.search;
    if (!scrollOffsets.get(locationId)) {
      scrollOffsets.set(locationId, Object.create(null));
    }
    currentScrollOffset = scrollOffsets.get(locationId);
    // Restore the scroll position if it was saved
    if (currentScrollOffset.scrollY !== undefined) {
      window.scrollTo(currentScrollOffset.scrollX, currentScrollOffset.scrollY);
    } else {
      window.scrollTo(0, 0);
    }

    trackPageview();
  });

  const { pathname, search, hash } = window.location;
  const location = `${pathname}${search}${hash}`;

  match({ routes, location }, (error, redirectLocation, renderProps) => {
    render(
      <ContextHolder context={context}>
        <Router {...renderProps} children={routes} history={Location} />
      </ContextHolder>,
      appContainer
    );
    // Remove the pre-rendered CSS because it's no longer used
    // after the React app is launched
    if (cssContainer) {
      cssContainer.parentNode.removeChild(cssContainer);
      cssContainer = null;
    }
  });

  // Save the page scroll position
  const supportPageOffset = window.pageXOffset !== undefined;
  const isCSS1Compat = ((document.compatMode || '') === 'CSS1Compat');
  const setPageOffset = () => {
    if (supportPageOffset) {
      currentScrollOffset.scrollX = window.pageXOffset;
      currentScrollOffset.scrollY = window.pageYOffset;
    } else {
      currentScrollOffset.scrollX = isCSS1Compat ?
        document.documentElement.scrollLeft : document.body.scrollLeft;
      currentScrollOffset.scrollY = isCSS1Compat ?
        document.documentElement.scrollTop : document.body.scrollTop;
    }
  };

  addEventListener(window, 'scroll', setPageOffset);
  addEventListener(window, 'pagehide', () => {
    removeEventListener(window, 'scroll', setPageOffset);
    unlisten();
  });
}

// Run the application when both DOM is ready and page content is loaded
if (['complete', 'loaded', 'interactive'].includes(document.readyState) && document.body) {
  run();
} else {
  document.addEventListener('DOMContentLoaded', run, false);
}
