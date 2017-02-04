/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import Layout from '../../components/Layout';
import fetch from '../../core/fetch';
import Login from './Login';

const title = 'Log In';

export default {

  path: '/login',

  async action() {
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
    if (!data || !data.auth) throw new Error('Failed to load the auth feed.');

    return {
      title,
      component: <Layout><Login title={title} thirdPartyAuth={data.auth} /></Layout>,
    };
  },

};
