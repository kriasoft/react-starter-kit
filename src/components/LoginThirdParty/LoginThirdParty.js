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
import s from './LoginThirdParty.css';

function LoginThirdParty({ to, buttonText, buttonClass, ...props }) {
  return (
    <div {...props}>
      <a className={s[buttonClass]} href={to}>
        <svg
          className={s.icon}
          width="30"
          height="30"
          viewBox="0 0 30 30"
          xmlns="http://www.w3.org/2000/svg"
        ><path /></svg>
        <span>{buttonText}</span>
      </a>
    </div>
  );
}

LoginThirdParty.propTypes = {
  to: PropTypes.string.isRequired,
  buttonText: PropTypes.string.isRequired,
  buttonClass: PropTypes.string.isRequired,
};

export default withStyles(s)(LoginThirdParty);
