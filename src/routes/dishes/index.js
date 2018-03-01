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
import Dishes from './Dishes';

const title = 'Your Dishes';

function action() {
  return {
    chunks: ['dishes'],
    title,
    component: (
      <Layout>
        <Dishes title={title} />
      </Layout>
    ),
  };
}

export default action;
