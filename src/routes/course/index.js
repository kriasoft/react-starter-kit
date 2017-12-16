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
import { setStudyEntities } from '../../actions/study_entities';

const title = 'Course';

async function action({ fetch, params, store }) {
  const resp = await fetch('/graphql', {
    body: JSON.stringify({
      query: `query courses($ids: [String]) {
        courses(ids: $ids) { id, title, studyEntities{ id,title }, users{ id,email } }
      }`,
      variables: {
        ids: params.id,
      },
    }),
  });
  const { data } = await resp.json();
  if (!data && !data.courses) throw new Error('Failed to load course.');
  store.dispatch(setStudyEntities(data.courses[0].studyEntities));
  const mas = [
    [
      {
        title: 'Users list',
        action: `/courses/${data.courses[0].id}/users`,
      },
    ],
    [
      {
        title: 'Test second level',
        action: `/`,
      },
    ],
  ];
  return {
    title,
    component: (
      <Layout menuSecond={mas}>
        <Course title={data.courses[0].title} course={data.courses[0]} />
      </Layout>
    ),
  };
}

export default action;
