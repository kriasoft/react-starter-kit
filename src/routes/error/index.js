import React from 'react';
import ErrorPage from './ErrorPage';

function action() {
  return {
    title: 'Demo Error',
    component: <ErrorPage />,
  };
}

export default action;
