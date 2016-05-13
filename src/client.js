/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import 'babel-polyfill';
import FastClick from 'fastclick';
import { createRouter } from 'universal-router/react';
import routes from './routes';

function run() {
  FastClick.attach(document.body);

  // Initialize app router and render React app into the DOM
  createRouter(routes, {
    context: {
      store: {}, // TODO: Create Flux/Redux store
    },
  }, document.getElementById('container'));
}

// Launch the app when DOM is ready (IE9+, Firefox 4+, Safari 3+, Chrome *, Opera *)
((doc, domContentLoaded) => {
  let listener;
  if ((doc.documentElement.doScroll ? /^loaded|^c/ : /^loaded|^i|^c/).test(doc.readyState)) {
    setTimeout(run, 0);
  } else {
    doc.addEventListener(domContentLoaded, listener = () => {
      doc.removeEventListener(domContentLoaded, listener);
      run();
    });
  }
})(document, 'DOMContentLoaded');
