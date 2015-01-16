/*
 * React.js Starter Kit
 * Copyright (c) 2014 Konstantin Tarkus (@koistya), KriaSoft LLC.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

'use strict';

require('./App.less');

var React = require('react');
var ExecutionEnvironment = require('react/lib/ExecutionEnvironment');
var AppActions = require('../../actions/AppActions');
var NavigationMixin = require('./NavigationMixin');
var AppStore = require('../../stores/AppStore');
var Navbar = require('../Navbar');
var ContentPage = require('../ContentPage');
var NotFoundPage = require('../NotFoundPage');

var Application = React.createClass({

  mixins: [NavigationMixin],

  propTypes: {
    path: React.PropTypes.string.isRequired,
    onSetTitle: React.PropTypes.func.isRequired,
    onSetMeta: React.PropTypes.func.isRequired,
    onPageNotFound: React.PropTypes.func.isRequired
  },

  getInitialState() {
    return {loading: false};
  },

  componentWillMount() {
    if (ExecutionEnvironment.canUseDOM) {
      this.setState({loading: true});
      AppActions.loadPage(this.props.path, () => {
        this.setState({loading: false});
      });
    }
  },

  render() {
    var page = AppStore.getPage(this.props.path);

    if (page === undefined) {
      return false;
    }

    this.props.onSetTitle(page.title);

    if (page.type === 'notfound') {
      this.props.onPageNotFound();
      return React.createElement(NotFoundPage, page);
    }

    return (
      /* jshint ignore:start */
      <div className="App">
        <Navbar />
        {
          this.props.path === '/' ?
          <div className="jumbotron">
            <div className="container text-center">
              <h1>React</h1>
              <p>Complex web apps made easy</p>
            </div>
          </div> :
          <div className="container">
            <h2>{page.title}</h2>
          </div>
        }
        <ContentPage className="container" {...page} />
        <div className="navbar-footer">
          <div className="container">
            <p className="text-muted">
              <span>© KriaSoft</span>
              <span><a href="/">Home</a></span>
              <span><a href="/privacy">Privacy</a></span>
            </p>
          </div>
        </div>
      </div>
      /* jshint ignore:end */
    );
  }

});

module.exports = Application;
