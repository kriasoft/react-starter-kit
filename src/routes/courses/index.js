import React from 'react';
import Layout from '../../components/Layout';
import Courses from './Courses';
import { fetchCourses } from '../../actions/courses';

const title = 'Courses';

async function action({ store }) {
  const { user } = store.getState();
  if (user) {
    await store.dispatch(fetchCourses(user.id));
  }

  return {
    chunks: ['courses'],
    title,
    component: (
      <Layout>
        <Courses title={title} />
      </Layout>
    ),
  };
}

export default action;
