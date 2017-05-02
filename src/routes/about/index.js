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
import Page from '../../components/Page';

export default {

  path: '/about',

  async action({ api }) {
    const [data, page] = await Promise.all([
      api.fetchQuery(graphql`query indexAboutQuery {
        me { ...Layout_me }
      }`),
      require.ensure([], require => require('./about.md'), 'about'),
    ]);

    return {
      title: page.title,
      chunk: 'about',
      component: <Layout me={data.me}><Page {...page} /></Layout>,
    };
  },

};
