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

import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import fetch from '../../core/fetch';
import LoginThirdPartyButton from './LoginThirdPartyButton';
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

class LoginThirdParty extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loginThirdParty: [],
    };
  }

  componentDidMount() {
    const stateSetter = this.setState.bind(this);
    getAuthData().then((data) => {
      stateSetter({
        loginThirdParty: data.auth,
      });
    });
  }

  render() {
    return (
      <div>
        {this.state.loginThirdParty.map(thirdPartyAuth => (
          <LoginThirdPartyButton
            className={s.formGroup}
            linkClassName={s[thirdPartyAuth.buttonClass]}
            iconClassName={s.icon}
            thirdPartyAuth={thirdPartyAuth}
            key={thirdPartyAuth.loginName}
          />
        ))}

        { this.state.loginThirdParty.lenght >= 1 ? <strong className={s.lineThrough}>OR</strong> : '' }
      </div>
    );
  }
}

export default withStyles(s)(LoginThirdParty);
