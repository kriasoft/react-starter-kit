/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import Layout from '../../components/Layout';
import Files from './Files';
import { fetchFiles } from '../../actions/files';

const title = 'Files';

async function action({ store }) {
  await store.dispatch(fetchFiles());
  return {
    chunks: ['files'],
    title,
    component: (
      <Layout>
        <Files title={title} />
      </Layout>
    ),
  };
}

export default action;
