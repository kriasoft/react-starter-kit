/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import cx from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Navigation.css';
import Link from '../Link';

class Navigation extends React.Component {
  render() {
    return (
      <div className="eight wide column right aligned text menu" role="navigation">
        <div className="ui secondary inverted horizontal compact pointing menu">
          <Link className="active item" to="/about">
            About
          </Link>
          <Link className="item" to="/contact">
            Contact
          </Link>
        </div>
        
        
        <div className="ui buttons">
          <Link to="/login">
              <div className="ui vertical inverted basic button">
                  Login
              </div>
          </Link>

          <Link to="/register" style={{marginLeft: "4px"}}>
              <div className="ui vertical inverted green animated button">
                <div className="visible content">
                    Sign up
                </div>
                <div className="hidden content">
                  For Free!
                </div>
              </div>
          </Link> 
        </div>

      </div>
    );
  }
}

export default withStyles(s)(Navigation);
