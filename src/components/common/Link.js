/*
 * React.js Starter Kit
 * Copyright (c) 2014 Konstantin Tarkus (@koistya), KriaSoft LLC.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

'use strict';

var React = require('react');
var RouteActions = require('../../actions/RouteActions');

var Link = React.createClass({

  propTypes: {
    to: React.PropTypes.string.isRequired
  },

  render() {
    this.props.href =
      this.props.to && this.props.to.lastIndexOf('/', 0) === 0 ?
      this.props.to : '/' + this.props.to;

    return (
      /* jshint ignore:start */
      <a onClick={this.handleClick} {...this.props}>{this.props.children}</a>
      /* jshint ignore:end */
    );
  },

  handleClick(e) {
    e.preventDefault();
    RouteActions.setRoute(this.props.to);
  }

});

module.exports = Link;
