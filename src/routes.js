/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import { IndexRoute, Route } from 'react-router';
import fetch from './core/fetch';
import App from './components/App';
import ContentPage from './components/ContentPage';
import ContactPage from './components/ContactPage';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import NotFoundPage from './components/NotFoundPage';

async function getContextComponent(location, callback) {
  const query = '/graphql?' +
    `query={content(path:"${location.pathname}"){path,title,content,component}}`;
  const response = await fetch(query);
  const { data } = await response.json();
  // using an arrow to pass page instance instead of page class; cb accepts class by default
  callback(null, () => <ContentPage {...data.content} />);
}

export default (
  <Route>
    <Route path="/" component={App}>
      <IndexRoute getComponent={getContextComponent} />
      <Route path="contact" component={ContactPage} />
      <Route path="login" component={LoginPage} />
      <Route path="register" component={RegisterPage} />
      <Route path="about" getComponent={getContextComponent} />
      <Route path="privacy" getComponent={getContextComponent} />
    </Route>
    <Route path="*" component={NotFoundPage} />
  </Route>
);
