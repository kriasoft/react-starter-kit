import React, { Component } from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';

// external-global styles must be imported in your JS.
import normalizeCss from 'normalize.css';
import layoutStyle from '../../../src/components/base/Layout/Layout.css'; // eslint-disable-line css-modules/no-unused-class
import overwrite from './overwrite.css';

const style = {
  backgroundSize: '20px 20px',
  backgroundPosition: '0 0, 10px 10px',
  backgroundImage:
    'linear-gradient(45deg, #efefef 25%, transparent 25%, transparent 75%, #efefef 75%, #efefef), linear-gradient(45deg, #efefef 25%, transparent 25%, transparent 75%, #efefef 75%, #efefef)',
  padding: 0,
  position: 'relative',
  margin: 0,
  width: '100%',
  float: 'left',
  clear: 'both',
};
/* Add the default Layout Styling to the Styleguide */
@withStyles(normalizeCss, layoutStyle, overwrite)
class Layout extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
  };

  render() {
    return <div style={style}>{this.props.children}</div>;
  }
}

export default Layout;
