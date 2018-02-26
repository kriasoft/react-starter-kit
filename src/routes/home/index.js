import React from 'react';
import Home from '../../components/templates/Home';
import Layout from '../../components/base/Layout';

async function action() {
  return {
    title: 'React Starter Kit',
    component: (
      <Layout>
        <Home />
      </Layout>
    ),
  };
}

export default action;
