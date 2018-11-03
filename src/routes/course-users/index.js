import React from 'react';
import Layout from '../../components/Layout';
import CourseUsers from './CourseUsers';
import { fetchCourse } from '../../actions/courses';

const title = 'Users of Course';

async function action({ params, store }) {
  const { user } = store.getState();
  if (!user) {
    return { redirect: '/login' };
  }
  await store.dispatch(fetchCourse(params.idCourse));
  return {
    chunks: ['courseUsers'],
    title,
    component: (
      <Layout>
        <CourseUsers />
      </Layout>
    ),
  };
}

export default action;
