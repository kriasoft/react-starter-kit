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
import Profile from './Profile';
import fetch from '../../core/fetch';

const title = 'Profile';

export default {

  path: '/profile',

  async action({ store }) {
    const { auth } = store.getState();
    if (!auth.user.id) {
      return { redirect: '/login' };
    }

    const resp = await fetch('/graphql', {
      method: 'post',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: '{me{username,email}}',
      }),
      credentials: 'include',
    });
    const { data } = await resp.json();
    if (!data || !data.me) throw new Error('Failed to load.');

    return {
      title,
      component: <Layout><Profile title={title} me={data.me} /></Layout>,
    };
  },

};
