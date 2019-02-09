import React from 'react';
import Layout from '../../components/Layout';
import Course from './Course';

async function action({ store }) {
  const { course } = store.getState();
  const { title } = course;
  return {
    chunks: ['courses'],
    title,
    component: (
      <Layout>
        <Course />
      </Layout>
    ),
  };
}

export default action;
