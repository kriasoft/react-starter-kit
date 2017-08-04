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
import s from './Header.css';
import Navigation from '../Navigation';

class Header extends React.Component {
  render() {
    return (
      <div>
        <Navigation />
        <div className="container">
          <div className="page-header">
            <h1>
              Yet Another Domic<small>Distance education made easy</small>
            </h1>
          </div>
        </div>
      </div>
    );
  }
}

export default withStyles(s)(Header);
