/**
 * @jsx React.DOM
 */

'use strict';

var React = require('react');
var {Routes, Route} = require('react-router');

React.renderComponent(
  <Routes location="history">
    <Route name="app" path="/" handler={require('./layouts/Default')}>
      <Route name="home" path="/" handler={require('./pages/Home')} />
      <Route name="privacy" handler={require('./pages/Privacy')} />
    </Route>
  </Routes>,
  document.body
);
