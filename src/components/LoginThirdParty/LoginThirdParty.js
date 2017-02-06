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


async function getAuthData() {
  const resp = await fetch('/graphql', {
    method: 'post',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: '{auth{loginName,buttonClass,buttonText,routeTo,icon}}',
    }),
    credentials: 'include',
  });

  const { data } = await resp.json();
  if (!data || !data.auth) throw new Error('can\'t load third party auth data');

  return data;
}

async function createThirdPartyContent(stateSetter) {
  const data = await getAuthData();

  stateSetter({
    loginThirdParty: data.auth,
    loginThirdPartyOr: data.auth.lenght >= 1 ? <strong className={s.lineThrough}>OR</strong> : '',
  });
}


function LoginThirdPartyButton({ thirdPartyAuth, ...props }) {
  console.log(props);
  return (
    <div {...props}>
      <a className={s[thirdPartyAuth.buttonClass]} href={thirdPartyAuth.routeTo}>
        <svg
          className={s.icon}
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
  thirdPartyAuth: PropTypes.shape({
    loginName: PropTypes.string,
    routeTo: PropTypes.string,
    buttonClass: PropTypes.string,
    icon: PropTypes.string,
    buttonText: PropTypes.string,
  }).isRequired,
};


class LoginThirdParty extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loginThirdParty: [],
      loginThirdPartyOr: '',
    };
  }
  componentDidMount() {
    createThirdPartyContent(this.setState.bind(this));
  }

  render() {
    return (
      <div>
        {this.state.loginThirdParty.map((auth, index) => (
          <LoginThirdPartyButton className={s.formGroup} thirdPartyAuth={auth} key={index} />
        ))}
        {this.state.loginThirdPartyOr}
      </div>
    );
  }
}

export default withStyles(s)(LoginThirdParty);
