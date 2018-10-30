import React from 'react';
import Layout from '../../components/Layout';
import Tests from './Tests';

const title = 'Tests';

function action({ store }) {
  const { user } = store.getState();
  if (!user) {
    return { redirect: '/login' };
  }
  return {
    chunks: ['tests'],
    title,
    component: (
      <Layout>
        <Tests title={title} />
      </Layout>
    ),
  };
}

export default action;
