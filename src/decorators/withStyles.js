/*! React Starter Kit | MIT License | http://www.reactstarterkit.com/ */

import React, { Component, PropTypes } from 'react';

function withStyles(...styles) {
  return (BaseComponent) => class StyledComponent extends Component {
    static contextTypes = {
      insertCss: PropTypes.func.isRequired,
    };

    componentWillMount() {
      this.removeCss = this.context.insertCss.apply(undefined, styles);
    }

    componentWillUnmount() {
      this.removeCss();
    }

    render() {
      return <BaseComponent {...this.props} />;
    }
  };
}

export default withStyles;
