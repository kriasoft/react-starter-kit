/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React, { PropTypes } from 'react';
import cx from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Navigation.scss';
import Link from '../Link';
import pages from './pages';

function Navigation() {
  return (
    <nav className={s.navigation} role="navigation">
      {pages.map((page, i) => {
        let linkStyle = {
          animationDelay: `${4 + i*1}s`
        };

        return (
          <Link className={s.link} key={i} to={page.route} style={linkStyle}>{page.name}</Link>
        )
      })}
    </nav>
  );
}

Navigation.propTypes = {
  className: PropTypes.string,
};

export default withStyles(Navigation, s);
