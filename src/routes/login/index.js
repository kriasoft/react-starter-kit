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
import Login from './Login';

const title = 'Log In';

export default {

  path: '/login',

  async action({ api }) {
    const data = await api.fetchQuery(graphql`query indexLoginQuery {
      me { ...Layout_me }
    }`);

    return {
      title,
      component: <Layout me={data.me}><Login title={title} /></Layout>,
    };
  },

};
