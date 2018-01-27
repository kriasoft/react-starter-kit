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
import Courses from './Courses';
import { setCourses } from '../../actions/courses';

const title = 'Courses';

async function action({ fetch, store }) {
  const { user } = store.getState();
  // TODO: restruct code for two different queries
  const resp = await fetch('/graphql', {
    body: JSON.stringify({
      query:
        user && !user.isAdmin
          ? 'query courses($users: [String]){ courses( userId: $users){ id, title } }'
          : 'query courses{ courses{ id, title }}',
      variables: {
        users: user ? [user.id] : [],
      },
    }),
  });
  const { data } = await resp.json();
  if (!data && !data.courses) throw new Error('Failed to load courses.');
  store.dispatch(setCourses(data.courses));
  return {
    title,
    component: (
      <Layout>
        <Courses title={title} />
      </Layout>
    ),
  };
}

export default action;
