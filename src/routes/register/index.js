import React from 'react';
import Layout from '../../components/Layout';
import Register from './Register';

const title = 'Sign up to NDO';

function action({ store }) {
  const { user } = store.getState();
  if (user) {
    return { redirect: '/login' };
  }
  return {
    chunks: ['register'],
    title,
    component: (
      <Layout>
        <Register title={title} />
      </Layout>
    ),
  };
}

export default action;
