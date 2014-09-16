/**
 * @jsx React.DOM
 */

'use strict';

var React = require('react');

var HomePage = React.createClass({
  render: () => {
    return (
      <div className="container">
        <h2>Facebook React Starter Kit</h2>
        <p>This is a single-page application (SPA) project template based on Facebook React.</p>
        <h4>Runtime Components:</h4>
        <ul>
          <li><a href="https://facebook.github.io/react/">React</a> - A JavaScript library for building user interfaces, developed by Facebook</li>
          <li><a href="https://github.com/rackt/react-router">React-Router</a> - A complete routing library for React</li>
          <li><a href="http://getbootstrap.com/">Bootstrap</a> - CSS framework for developing responsive, mobile first interfaces</li>
        </ul>
        <h4>Development Tools:</h4>
        <ul>
          <li><a href="http://webpack.github.io/">Webpack</a> - Compiles front-end source code into modules / bundles</li>
          <li><a href="http://gulpjs.com">Gulp</a> - JavaScript streaming build system and task automation</li>
        </ul>
        <h3>Fork me on GitHub</h3>
        <p><a href="https://github.com/kriasoft/react-seed">https://github.com/kriasoft/react-seed</a></p>
      </div>
    );
  }
});

module.exports = HomePage;
