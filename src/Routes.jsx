/**
 * @jsx React.DOM
 */

'use strict';

var RouteActions  = require('./actions/RouteActions');

var ReactRouter   = require('react-router');
var Routes        = ReactRouter.Routes;
var Route         = ReactRouter.Route;
var DefaultRoute  = ReactRouter.DefaultRoute;
var NotFoundRoute = ReactRouter.NotFoundRoute;

var DefaultLayout = require('./layouts/DefaultLayout.jsx');

var HomePage    = require('./pages/HomePage.jsx')
var PrivacyPage = require('./pages/PrivacyPage.jsx')
var NotFound    = require('./pages/NotFound.jsx')

module.exports = (
  <Routes location="hash" onActiveStateChange={RouteActions.setRoute}>
    <Route name="app" path="/" handler={DefaultLayout}>
      <Route name="privacy" handler={PrivacyPage} />
      <DefaultRoute handler={HomePage} />
      <NotFoundRoute handler={NotFound} />
    </Route>
  </Routes>
);
