/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

// import React from 'react';
// import Router from 'react-routing/src/Router';
import fetch from './core/fetch';
import App from './components/App';
import ContentPage from './components/ContentPage';
import ContactPage from './components/ContactPage';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
// import NotFoundPage from './components/NotFoundPage';
// import ErrorPage from './components/ErrorPage';
import fs from 'fs';
import path from 'path';

// const router = new Router(on => {
//   on('*', async (state, next) => {
//     const component = await next();
//     return component && <App context={state.context}>{component}</App>;
//   });

//   on('/contact', async () => <ContactPage />);

//   on('/login', async () => <LoginPage />);

//   on('/register', async () => <RegisterPage />);

//   on('*', async (state) => {
//     const response = await fetch(`/api/content?path=${state.path}`);
//     const content = await response.json();
//     return content && <ContentPage {...content} />;
//   });

//   on('error', (state, error) => state.statusCode === 404 ?
//     <App context={state.context} error={error}><NotFoundPage /></App> :
//     <App context={state.context} error={error}><ErrorPage /></App>
//   );
// });

// export default router;

let ContactRoute = {
  path: '/contact',
  component: ContactPage
};

let LoginRoute = {
  path: '/login',
  component: LoginPage
};

let RegisterRoute = {
  path: '/register',
  component: RegisterPage
}

function getContentRoute(location, callback) {
  return fetch(`/api/content?path=${location.pathname}`).then(function(result) {
    return result.json();
  }).then(function(response) {
    callback(null, {component: ContentPage, props: response});
  });
}

function getContentRoutes() {
  let routes = [];
  let contentPath = path.resolve('./src/content');
  console.log("--- path", contentPath);
  let files = fs.readdirSync(contentPath);
  files.forEach((file) => {
    if (path.extname(file) === '.jade') {
      routes.push({
        path: '/' + path.basename(file, '.jade'),
        component: App,
        getIndexRoute(location, callback) {
          getContentRoute(location, callback);
        }
      });
    }
  });
  return routes;
}

let RootRoute = {
  path: '/',
  component: App,
  getChildRoutes(location, callback) {
    callback(null, [ContactRoute, LoginRoute, RegisterRoute]);
  },
  getIndexRoute(location, callback) {
    getContentRoute(location, callback);
  }
}

export default [RootRoute, ...getContentRoutes()];
