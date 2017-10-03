import React, { Component } from 'react';
import PropTypes from 'prop-types';

import ContextProvider from './ContextProvider';
import Layout from './Layout';

const context = {
  insertCss: (...styles) => {
    // eslint-disable-next-line no-underscore-dangle
    const removeCss = styles.map(x => x._insertCss());
    return () => {
      removeCss.forEach(f => f());
    };
  },
};

// The actual wrapper
class Wrapper extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
  };

  render() {
    return (
      <ContextProvider context={context}>
        <Layout>{this.props.children}</Layout>
      </ContextProvider>
    );
  }
}

export default Wrapper;
