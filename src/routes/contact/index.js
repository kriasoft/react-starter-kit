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
import Contact from './Contact';

const title = 'Contact Us';

export default {

  path: '/contact',

  async action({ api }) {
    const data = await api.fetchQuery(graphql`query indexContactQuery {
      me { ...Layout_me }
    }`);
    return {
      title,
      component: <Layout me={data.me}><Contact title={title} /></Layout>,
    };
  },

};
