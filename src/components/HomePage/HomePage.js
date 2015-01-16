/*
 * React.js Starter Kit
 * Copyright (c) 2014 Konstantin Tarkus (@koistya), KriaSoft LLC.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

'use strict';

var React = require('react');

var HomePage = React.createClass({

  propTypes: {
    body: React.PropTypes.string.isRequired
  },

  render() {
    /* jshint ignore:start */
    return <div className="ContentPage"
      dangerouslySetInnerHTML={{__html: this.props.body}} />;
    /* jshint ignore:end */
  }

});

module.exports = HomePage;
