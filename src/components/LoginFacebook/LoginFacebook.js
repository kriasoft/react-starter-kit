/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React, { Component, PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './LoginFacebook.css';

class LoginFacebook extends Component {

  render() {

    const { ...props } = this.props;
    return (
      <div {...props}>
        <a className={s.facebook} href="/login/facebook">
          <svg
            className={s.icon}
            width="30"
            height="30"
            viewBox="0 0 30 30"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M22 16l1-5h-5V7c0-1.544.784-2 3-2h2V0h-4c-4.072 0-7 2.435-7 7v4H7v5h5v14h6V16h4z"
            />
          </svg>
          <span>Log in with Facebook</span>
        </a>
      </div>
    );
  }

}

export default withStyles(s)(LoginFacebook);
