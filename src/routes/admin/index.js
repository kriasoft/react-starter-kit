/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import { graphql } from 'relay-runtime';
import Layout from '../../components/Layout';

const title = 'Admin Page';
const isAdmin = false;

export default {

  path: '/admin',

  async action({ api }) {
    if (!isAdmin) {
      return { redirect: '/login' };
    }

    const [data, Admin] = await Promise.all([
      api.fetchQuery(graphql`query indexAdminQuery {
        me { ...Layout_me }
      }`),
      require.ensure([], require => require('./Admin').default, 'admin'),
    ]);

    return {
      title,
      chunk: 'admin',
      component: <Layout me={data.me}><Admin title={title} /></Layout>,
    };
  },

};
