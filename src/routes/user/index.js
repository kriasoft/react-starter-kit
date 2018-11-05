import React from 'react';
import Layout from '../../components/Layout';
import User from './User';
import userQuery from '../../gql/user.gql';

const title = 'User';

async function action({ fetch, params, store }) {
  const { user } = store.getState();
  if (!user) {
    return { redirect: '/login' };
  }
  const resp = await fetch('/graphql', {
    body: JSON.stringify({
      query: userQuery,
      variables: {
        id: params.idUser,
      },
    }),
  });
  const { data } = await resp.json();
  if (!data && !data.users) throw new Error('Failed to load user profile.');
  return {
    chunks: ['user'],
    title,
    component: (
      <Layout>
        <User title={title} id={data.users[0].id} user={data.users[0]} />
      </Layout>
    ),
  };
}

export default action;
