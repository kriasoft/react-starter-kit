/**
 * @jsx React.DOM
 */

'use strict';

var React = require('react');

var Navbar = React.createClass({
  render: function () {
    return (
      <div className="navbar-top">
        <div className="container">
          <a className="navbar-brand" href="/"><img src="/images/logo-small.png" width="38" height="38" alt="" /> React Seed</a>
        </div>
      </div>
    );
  }
});

module.exports = Navbar;
