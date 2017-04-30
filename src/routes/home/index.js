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
import Home from './Home';
import Layout from '../../components/Layout';

export default {

  path: '/',

  async action({ api }) {
    const data = await api.fetchQuery(graphql`
      query indexQuery {
        news {
          ...Home_news
        }
      }
    `);
    if (!data.news) throw new Error('Failed to load the news feed.');
    return {
      title: 'React Starter Kit',
      component: <Layout><Home news={data.news} /></Layout>,
    };
  },

};
