'use strict';

var React = require('react');
var Link = require('./Link');

var Navbar = React.createClass({
  render() {
    return (
      <div className="navbar-top" role="navigation">
        <div className="container">
          <Link className="navbar-brand row" to="/">
            <img src="/images/logo-small.png" width="38" height="38" alt="React" />
            <span>React.js Starter Kit</span>
          </Link>
        </div>
      </div>
    );
  }
});

module.exports = Navbar;
