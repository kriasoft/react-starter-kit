import React from 'react';
import Layout from '../../components/Layout';
import Login from './Login';

const title = 'Log In';

function action({ store }) {
  const { user } = store.getState();
  if (user) {
    return { redirect: '/login' };
  }
  return {
    chunks: ['users'],
    title,
    component: (
      <Layout>
        <Login />
      </Layout>
    ),
  };
}

export default action;
