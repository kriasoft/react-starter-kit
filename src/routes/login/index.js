/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import { defineMessages } from 'react-intl';
import Layout from '../../components/Layout';
import Login from './Login';

const messages = defineMessages({
  title: {
    id: 'login.title',
    description: 'Log in page title',
    defaultMessage: 'Log In',
  },
});

function action({ intl }) {
  const title = intl.formatMessage(messages.title);
  return {
    chunks: ['login'],
    title,
    component: <Layout><Login title={title} /></Layout>,
  };
}

export default action;
