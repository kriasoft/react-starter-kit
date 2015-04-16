/*
 * React.js Starter Kit
 * Copyright (c) 2014 Konstantin Tarkus (@koistya), KriaSoft LLC.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React, { Component } from 'react'; // eslint-disable-line no-unused-vars
import { canUseDOM } from 'react/lib/ExecutionEnvironment';

function setViewport(ComposedComponent) {
  return class AppViewport extends Component {

    constructor() {
      super();

      this.state = {
        viewport: canUseDOM ?
          {width: window.innerWidth, height: window.innerHeight} :
          {width: 1366, height: 768} // Default size for server-side rendering
      };

      this.handleResize = () => {
        let viewport = {width: window.innerWidth, height: window.innerHeight};
        if (this.state.viewport.width !== viewport.width ||
          this.state.viewport.height !== viewport.height) {
          this.setState({viewport: viewport});
        }
      };
    }

    componentDidMount() {
      window.addEventListener('resize', this.handleResize);
      window.addEventListener('orientationchange', this.handleResize);
    }

    componentWillUnmount() {
      window.removeEventListener('resize', this.handleResize);
      window.removeEventListener('orientationchange', this.handleResize);
    }

    render() {
      return <ComposedComponent {...this.props} viewport={this.state.viewport}/>;
    }

  };
}

export default setViewport;
