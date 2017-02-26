/* eslint-disable css-modules/no-unused-class */
/* eslint-disable css-modules/no-undef-class */
/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React, { PropTypes } from 'react';

function LoginThirdPartyButton({
  thirdPartyAuth,
  linkClassName,
  iconClassName,
  ...props
}) {
  return (
    <div {...props}>
      <a className={linkClassName} href={thirdPartyAuth.routeTo}>
        <svg
          className={iconClassName}
          width="30"
          height="30"
          viewBox="0 0 30 30"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d={thirdPartyAuth.icon} />
        </svg>
        <span>{thirdPartyAuth.buttonText}</span>
      </a>
    </div>
  );
}

LoginThirdPartyButton.propTypes = {
  linkClassName: PropTypes.string.isRequired,
  iconClassName: PropTypes.string.isRequired,
  thirdPartyAuth: PropTypes.shape({
    loginName: PropTypes.string,
    routeTo: PropTypes.string,
    buttonClass: PropTypes.string,
    icon: PropTypes.string,
    buttonText: PropTypes.string,
  }).isRequired,
};

export default LoginThirdPartyButton;
