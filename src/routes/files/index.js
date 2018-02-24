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

const title = 'Files';

async function action({ fetch }) {
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
  return {
    title,
    component: (
      <Layout>
        <Files title={title} files={data.files} />
      </Layout>
    ),
  };
}

export default action;
