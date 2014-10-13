/**
 * @jsx React.DOM
 */

'use strict';

var React = require('react');
var Link = require('../components/Link.jsx');
var Navbar = require('../components/Navbar.jsx');

var DefaultLayout = React.createClass({
  propTypes: {
    title: React.PropTypes.string,
    breadcrumb: React.PropTypes.component
  },
  getDefaultProps() {
    return {
      title: 'React.js Starter Kit',
      description: 'A skeleton for an isomorphic web application (SPA) built with React.js and Flux'
    };
  },
  render() {
    var header = this.props.breadcrumb ? (
      <div className="container">
        <h2>{this.props.title}</h2>
        {this.props.breadcrumb}
      </div>
    ) : (
      <div className="jumbotron">
        <div className="container text-center">
          <h1>React</h1>
          <p>Complex web apps made easy</p>
        </div>
      </div>
    );

    return (
      <div>
        <Navbar />
        {header}
        {this.props.children}
        <div className="navbar-footer">
          <div className="container">
            <p className="text-muted">
              <span>© KriaSoft</span>
              <span><Link to="/">Home</Link></span>
              <span><Link to="/privacy">Privacy</Link></span>
            </p>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = DefaultLayout;
