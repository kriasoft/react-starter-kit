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
import { fetchCourse } from '../../actions/courses';

async function action({ params, store }) {
  await store.dispatch(fetchCourse(params.idCourse));
  const { course } = store.getState();

  const mas = [
    [
      {
        title: 'Units',
        action: `/courses/${course.id}`,
        isActive: true,
      },
      {
        title: 'Users list',
        action: `/courses/${course.id}/users`,
      },
      {
        title: 'Marks list',
        action: `/courses/${course.id}/marks`,
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
    chunks: ['course'],
    title: course.title,
    component: (
      <Layout menuSecond={mas}>
        <Course />
      </Layout>
    ),
  };
}

export default action;
