/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */
import React from 'react';
import PropTypes from 'prop-types';

// external-global styles must be imported in your JS.
import LayoutGlobalStyle from './styled';
import Header from '../Header';
import Feedback from '../Feedback';
import Footer from '../Footer';

export default function Layout({ children }) {
  return (
    <>
      <LayoutGlobalStyle />
      <Header />
      {children}
      <Feedback />
      <Footer />
    </>
  );
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};
