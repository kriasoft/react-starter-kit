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
  const { title } = course;
  return {
    chunks: ['course'],
    title,
    component: (
      <Layout>
        <Course />
      </Layout>
    ),
  };
}

export default action;
