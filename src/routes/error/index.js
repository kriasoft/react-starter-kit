import React from 'react';
import ErrorPage from '../../components/templates/ErrorPage';

function action() {
  return {
    title: 'Demo Error',
    component: <ErrorPage />,
  };
}

export default action;
