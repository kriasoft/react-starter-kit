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
import Today from './Today';
// import Table from '../../components/Table';

const title = "Today's Menu";

function action() {
  return {
    chunks: ['today'],
    title,
    component: (
      <Layout>
        <Today title={title} />
        {/* <Table /> */}
      </Layout>
    ),
  };
}

export default action;
