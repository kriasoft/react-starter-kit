import React from 'react';
import Layout from '../../components/Layout';
import CourseUsers from './CourseUsers';

const title = 'Users of Course';

async function action({ fetch, params, store }) {
  const { user } = store.getState();
  if (!user) {
    return { redirect: '/' };
  }
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
  return {
    chunks: ['courseUsers'],
    title,
    component: (
      <Layout>
        <CourseUsers title={data.courses[0].title} course={data.courses[0]} />
      </Layout>
    ),
  };
}

export default action;
