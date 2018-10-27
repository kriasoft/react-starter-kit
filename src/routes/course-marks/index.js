import React from 'react';
import Layout from '../../components/Layout';
import CourseMarks from './CourseMarks';

const title = 'Users of Course';

async function action({ fetch, params, store }) {
  const resp = await fetch('/graphql', {
    body: JSON.stringify({
      query: `query courses($ids: [String], $userIds: [String]) {
        courses(ids: $ids) {
          id,
          title,
          units {
            id,
            title
            answers(userIds:$userIds) {
              id,
              marks{
                id,
                mark,
                createdAt,
              }
            }
          }
        }
      }`,
      variables: {
        ids: params.idCourse,
        userIds: store.getState().user.id,
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
