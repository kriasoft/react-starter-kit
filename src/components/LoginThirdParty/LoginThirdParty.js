/* eslint-disable css-modules/no-unused-class */
/* eslint-disable css-modules/no-undef-class */
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
import fetch from '../../core/fetch';

import s from '../LoginThirdParty/LoginThirdParty.css';


function LoginThirdParty({ thirdPartyAuth, ...props }) {
  return (
    <div {...props}>
      {thirdPartyAuth.map((auth, index) => (
        <div className={s.formGroup}>
          <a className={s[auth.buttonClass]} href={auth.routeTo}>
            <svg
              className={s.icon}
              width="30"
              height="30"
              viewBox="0 0 30 30"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d={auth.icon} />
            </svg>
            <span>{auth.buttonText}</span>
          </a>
        </div>
      ))}
    </div>
  );
}

LoginThirdParty.propTypes = {
  thirdPartyAuth: PropTypes.arrayOf(PropTypes.shape({
    loginName: PropTypes.string,
    routeTo: PropTypes.string.isRequired,
    buttonClass: PropTypes.string.isRequired,
    icon: PropTypes.string.isRequired,
    buttonText: PropTypes.string.isRequired,
  })).isRequired,
};

export default withStyles(s)(LoginThirdParty);
