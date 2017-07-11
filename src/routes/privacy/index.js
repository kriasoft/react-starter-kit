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
import Page from '../../components/Page';

async function action({ locale }) {
  const data = await new Promise((resolve) => {
    require.ensure([], (require) => {
      try {
        resolve(require(`./privacy.${locale}.md`)); // eslint-disable-line import/no-dynamic-require
      } catch (e) {
        resolve(require('./privacy.md'));
      }
    }, 'privacy');
  });

  return {
    title: data.title,
    chunk: 'privacy',
    component: <Layout><Page {...data} /></Layout>,
  };
}

export default action;
