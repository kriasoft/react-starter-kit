import React, { Component } from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';

// external-global styles must be imported in your JS.
import normalizeCss from 'normalize.css';
import layoutStyle from '../../../src/components/base/Layout/Layout.css';

/* Add the default Layout Styling to the Styleguide */
@withStyles(normalizeCss, layoutStyle)
class Layout extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
  };

  render() {
    return <div>{this.props.children}</div>;
  }
}

export default Layout;
