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
import StudyEntity from './StudyEntity';

const title = 'Study Entity';

async function action({ fetch, params }) {
  const resp = await fetch('/graphql', {
    body: JSON.stringify({
      query: `query courses($idCourse: [String], $idStudyEntity: [String]) {
        courses(ids: $idCourse) { id, title },
        studyEntities(ids: $idStudyEntity) { id, title, body } 
      }`,
      variables: {
        idCourse: params.idCourse,
        idStudyEntity: params.idStudyEntity,
      },
    }),
  });
  const { data } = await resp.json();
  if (!data && !data.courses.length && !data.studyEntities.length)
    throw new Error('Failed to load course.');
  return {
    title,
    component: (
      <Layout>
        <StudyEntity
          course={data.courses[0]}
          studyEntity={data.studyEntities[0]}
        />
      </Layout>
    ),
  };
}

export default action;
