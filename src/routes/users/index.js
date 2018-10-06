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
import Users from './Users';
import { fetchUsers } from '../../actions/users';
import { fetchGroups } from '../../actions/groups';

const title = 'Users';

async function action({ store }) {
  store.dispatch(fetchUsers());
  store.dispatch(fetchGroups());
  return {
    chunks: ['users'],
    title,
    component: (
      <Layout>
        <Users title={title} />
      </Layout>
    ),
  };
}

export default action;
