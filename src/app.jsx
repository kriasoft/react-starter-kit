/**
 * @jsx React.DOM
 */

var React = require('react');
var Router = require('react-router');

var Routes = Router.Routes;
var Route = Router.Route;

var DefaultLayout = require('./layouts/Default.jsx');
var HomePage = require('./pages/Home.jsx');
var PrivacyPage = require('./pages/Privacy.jsx');

React.renderComponent(
    <Routes location="history">
        <Route name="app" path="/" handler={DefaultLayout}>
            <Route name="home" path="/" handler={HomePage} />
            <Route name="privacy" path="/privacy" handler={PrivacyPage} />
        </Route>
    </Routes>,
    document.body
);
