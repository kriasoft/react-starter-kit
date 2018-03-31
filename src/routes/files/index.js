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
import { setFiles } from '../../actions/files';

const title = 'Files';

async function action({ fetch, store }) {
  const resp = await fetch('/graphql', {
    body: JSON.stringify({
      query: `query {
        files {
          internalName,
          id,
          url
        }
      }`,
    }),
  });
  const { data } = await resp.json();
  if (!data && !data.files) throw new Error('Failed to load course.');
  store.dispatch(setFiles(data.files));
  return {
    title,
    component: (
      <Layout>
        <Files title={title} />
      </Layout>
    ),
  };
}

export default action;
