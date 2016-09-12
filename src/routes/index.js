/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import App from '../components/App';

// Child routes
import home from './home';
import contact from './contact';
import login from './login';
import register from './register';
import content from './content';
import notFound from './notFound';

export default {

  path: '/',

  // keep in mind, routes are evaluated in order
  children: [
    home,
    contact,
    login,
    register,

    // place new routes before...
    content,
    notFound,
  ],

  async action({ next, context }) {
    let route;

    // Execute each child route until one of them return the result
    // TODO: move this logic to the `next` function
    do {
      route = await next();
    } while (!route);

    return {
      ...route,

      // Override the result of child route with extensions
      title: `${route.title || 'Untitled Page'} - www.reactstarterkit.com`,
      description: route.description || '',
      component: <App context={context}>{route.component}</App>,
    };
  },

};
