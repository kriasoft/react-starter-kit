/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React, { FunctionComponent } from 'react';
import useStyles from 'isomorphic-style-loader/useStyles';

// external-global styles must be imported in your JS.
import normalizeCss from 'normalize.css';
import s from './Layout.css';
import Header from '../Header';
import Feedback from '../Feedback';
import Footer from '../Footer';

interface PropTypes {}

const Layout: FunctionComponent<PropTypes> = ({ children }) => {
  useStyles(normalizeCss, s);
  return (
    <div>
      <Header />
      {children}
      <Feedback />
      <Footer />
    </div>
  );
};

export default Layout;
