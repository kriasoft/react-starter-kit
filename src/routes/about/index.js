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
import about from './about.md';
import withColumns, { defaultColumnData } from '../../../tools/lib/columns';

function action() {
  // Displays a wide left column and narrow right column
  // withColumns(about, {rightColumnKey: 'right-column',
  //  columnsKey: 'global-columns' }
  // Displays a wide right column and narrow left column
  // withColumns(about, {leftColumnKey: 'left-column',
  //
  // Displays both columns using the column data found in the global-columns
  // directory under the routes directory
  withColumns(about, defaultColumnData);
  return {
    chunks: [about.key],
    component: (
      <Layout>
        <Page {...about} />
      </Layout>
    ),
  };
}

export default action;
