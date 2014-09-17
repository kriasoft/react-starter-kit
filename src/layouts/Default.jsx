/**
 * @jsx React.DOM
 */

'use strict';

var React = require('react');
var {Link} = require('react-router');
var Navbar = require('../components/Navbar.jsx');

var DefaultLayout = React.createClass({
  render: () => {
    return (
      <div>
        <Navbar />
        <this.props.activeRouteHandler />
        <div className="navbar-footer">
          <div className="container">
            <p className="text-muted">&copy; KriaSoft • <Link to="home">Home</Link> • <Link to="privacy">Privacy</Link></p>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = DefaultLayout;
