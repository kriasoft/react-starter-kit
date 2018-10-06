/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

/* eslint-disable global-require */

// The top-level (parent) route
const routes = {
  path: '',

  // Keep in mind, routes are evaluated in order
  children: [
    {
      path: '/courses',
      load: () => import(/* webpackChunkName: 'courses' */ './courses'),
    },
    {
      path: '/courses/:idCourse',
      load: () => import(/* webpackChunkName: 'course' */ './course'),
    },
    {
      path: '/courses/:idCourse/users',
      load: () =>
        import(/* webpackChunkName: 'courseUsers' */ './course-users'),
    },
    {
      path: '/courses/:idCourse/marks',
      load: () =>
        import(/* webpackChunkName: 'courseMarks' */ './course-marks'),
    },
    {
      path: '/courses/:idCourse/:idUnit',
      load: () => import(/* webpackChunkName: 'unit' */ './unit'),
    },
    {
      path: '/users',
      load: () => import(/* webpackChunkName: 'users' */ './users'),
    },
    {
      path: '/users/:idUser',
      load: () => import(/* webpackChunkName: 'user' */ './user'),
    },
    {
      path: '',
      load: () => import(/* webpackChunkName: 'home' */ './home'),
    },
    {
      path: '/login',
      load: () => import(/* webpackChunkName: 'login' */ './login'),
    },
    {
      path: '/register',
      load: () => import(/* webpackChunkName: 'register' */ './register'),
    },
    {
      path: '/privacy',
      load: () => import(/* webpackChunkName: 'privacy' */ './privacy'),
    },
    {
      path: '/admin',
      load: () => import(/* webpackChunkName: 'admin' */ './admin'),
    },
    {
      path: '/files',
      load: () => import(/* webpackChunkName: 'files' */ './files'),
    },
    {
      path: '/tests',
      load: () => import(/* webpackChunkName: 'tests' */ './tests'),
    },
    // Wildcard routes, e.g. { path: '(.*)', ... } (must go last)
    {
      path: '(.*)',
      load: () => import(/* webpackChunkName: 'not-found' */ './not-found'),
    },
  ],

  async action({ next }) {
    // Execute each child route until one of them return the result
    const route = await next();

    // Provide default values for title, description etc.
    route.title = `${route.title || 'Untitled Page'} - NDO`;
    route.description = route.description || '';

    return route;
  },
};

// The error page is available by permanent url for development mode
if (__DEV__) {
  routes.children.unshift({
    path: '/error',
    action: require('./error').default,
  });
}

export default routes;
