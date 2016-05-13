/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import Layout from '../../components/Layout';
import ErrorPage from './ErrorPage';

export default {

  path: '/error',

  action({ error }) {
    return {
      status: error.status || 500,
      title: error.status === 404 ? 'Page Not Found' : 'Error',
      component: (
        <Layout error={error}>
          <ErrorPage error={error} />
        </Layout>
      ),
    };
  },

};
