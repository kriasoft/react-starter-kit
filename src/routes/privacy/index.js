/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import Layout from '../../components/Layout';
import Page from '../../components/Page';
import privacy from './privacy.md';

function action() {
  return {
    chunks: ['privacy'],
    title: privacy.title,
    component: (
      <Layout>
        <Page {...privacy} />
      </Layout>
    ),
  };
}

export default action;
