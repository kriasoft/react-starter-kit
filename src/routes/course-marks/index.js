import React from 'react';
import Layout from '../../components/Layout';
import CourseMarks from './CourseMarks';
import marksQuery from '../../gql/marks.gql';

const title = 'Users of Course';

async function action({ fetch, params, store }) {
  const { user } = store.getState();
  if (!user) {
    return { redirect: '/login' };
  }
  const resp = await fetch('/graphql', {
    body: JSON.stringify({
      query: marksQuery,
      variables: {
        ids: params.idCourse,
        // userIds: store.getState().user.id,
      },
    }),
  });
  const { data } = await resp.json();
  if (!data && !data.courses)
    throw new Error('Failed to load user of a course.');
  return {
    chunks: ['courseMarks'],
    title,
    component: (
      <Layout>
        <CourseMarks course={data.courses[0]} />
      </Layout>
    ),
  };
}

export default action;
