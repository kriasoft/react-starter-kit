import React from 'react';
import { IndexRoute, Route } from 'react-router';

import App from '../components/App';
import Contact from './contact';
import Content from './content';
import ErrorPage from './error';
import Home from './home';
import Login from './login';
import Register from './register';

/**
 * all routes
 */
export default (
  <Route path="/" component={App}>
    <IndexRoute component={Home} />
    <Route path="contact" components={Contact} />
    <Route path="login" components={Login} />
    <Route path="register" components={Register} />
    <Route path="error" components={ErrorPage} />
    <Route path="*" components={Content} />
  </Route>
);
