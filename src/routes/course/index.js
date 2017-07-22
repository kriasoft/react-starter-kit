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
import Course from './Course';

const title = 'Course';

async function action({ fetch, params }) {
  const resp = await fetch('/graphql', {
    body: JSON.stringify({
      query: `{ courses(ids:"${params.id}") { id, title, studyEntities{ id,title } } }`,
    }),
  });
  const { data } = await resp.json();
  if (!data && !data.courses) throw new Error('Failed to load course.');
  return {
    title,
    component: (
      <Layout>
        <Course title={data.courses[0].title} course={data.courses[0]} />
      </Layout>
    ),
  };
}

export default action;
