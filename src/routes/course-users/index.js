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
import CourseUsers from './CourseUsers';

const title = 'Users of Course';

async function action({ fetch, params }) {
  const resp = await fetch('/graphql', {
    body: JSON.stringify({
      query: `query courses($ids: [String]) {
        courses(ids: $ids) { id, title, users{ id, email, role } }
      }`,
      variables: {
        ids: params.idCourse,
      },
    }),
  });
  const { data } = await resp.json();
  if (!data && !data.courses)
    throw new Error('Failed to load user of a course.');
  const mas = [
    [
      {
        title: 'Study entities',
        action: `/courses/${data.courses[0].id}`,
      },
      {
        title: 'Users list',
        action: `/courses/${data.courses[0].id}/users`,
        isActive: true,
      },
      {
        title: 'Marks list',
        action: `/courses/${data.courses[0].id}/marks`,
      },
    ],
  ];
  return {
    title,
    component: (
      <Layout menuSecond={mas}>
        <CourseUsers title={data.courses[0].title} course={data.courses[0]} />
      </Layout>
    ),
  };
}

export default action;
