/**
 * @jsx React.DOM
 */

'use strict';

var React = require('react');

var Navbar = React.createClass({
  render: () => {
    return (
      <div className="navbar-top">
        <div className="container">
          <a className="navbar-brand" href="/"><img src="/images/logo-small.png" width="38" height="38" alt="" /> Facebook React Starter Kit</a>
        </div>
      </div>
    );
  }
});

module.exports = Navbar;
