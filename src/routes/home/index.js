/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import Home from './Home';
import Layout from '../../components/Layout';

const title = "What's for dinner";

function action() {
  return {
    title: 'Home',
    component: (
      <Layout>
        <Home title={title} />
      </Layout>
    ),
  };
}

export default action;
