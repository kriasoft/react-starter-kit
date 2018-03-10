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

const title = 'Users';

async function action({ fetch }) {
  const resp = await fetch('/graphql', {
    body: JSON.stringify({
      query: '{ users{ id,email,isAdmin },groups{ id, title,} }',
    }),
  });
  const { data } = await resp.json();
  if (!data && !data.users && !data.groups)
    throw new Error('Failed to load users.');
  return {
    title,
    component: (
      <Layout>
        <Users title={title} users={data.users} groups={data.groups} />
      </Layout>
    ),
  };
}

export default action;
