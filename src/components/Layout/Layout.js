/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React, { PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Layout.scss';
import Header from '../Header';
import Feedback from '../Feedback';
import Footer from '../Footer';

function Layout({ error, children }) {
  return !error ? (
    <div>
      <Header />
      {children}
      <Feedback />
      <Footer />
    </div>
  ) : children;
}

Layout.contextTypes = {
  insertCss: PropTypes.func.isRequired,
};

Layout.propTypes = {
  children: PropTypes.element.isRequired,
  error: PropTypes.object,
};

export default withStyles(s)(Layout);
