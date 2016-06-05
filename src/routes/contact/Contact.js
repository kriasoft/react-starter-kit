/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Contact.css';
import Helmet from 'react-helmet';

const title = 'Contact Us';

function Contact() {
  return (
    <div className={s.root}>
      <Helmet title={title} />
      <div className={s.container}>
        <h1>{title}</h1>
        <p>...</p>
      </div>
    </div>
  );
}

export default withStyles(s)(Contact);
