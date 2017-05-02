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
import NotFound from './NotFound';

const title = 'Page Not Found';

export default {

  path: '*',

  async action({ api }) {
    const data = await api.fetchQuery(graphql`query indexNotFoundQuery {
      me { ...Layout_me }
    }`);

    return {
      title,
      component: <Layout me={data.me}><NotFound title={title} /></Layout>,
      status: 404,
    };
  },

};
