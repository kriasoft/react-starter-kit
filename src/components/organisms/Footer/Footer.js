/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';

import s from './Footer.css';

import Link from '../../atoms/Link';

@withStyles(s)
class Footer extends React.Component {
  render() {
    return (
      <div className={s.root}>
        <div className={s.container}>
          <span className={s.text}>© Your Company</span>
          <span className={s.spacer}>·</span>
          <Link className={s.link} name="home">
            Home
          </Link>
          <span className={s.spacer}>·</span>
          <Link className={s.link} name="content" params={{ page: 'about' }}>
            About
          </Link>
          <span className={s.spacer}>·</span>
          <Link className={s.link} name="contact">
            Contact
          </Link>
        </div>
      </div>
    );
  }
}

export default Footer;
