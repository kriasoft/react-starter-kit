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
import Content from './Content';
import { getContent } from '../../actions/content';
import { selectContent } from '../../reducers/content';

export default {

  path: '*',

  async action({ path, store }) { // eslint-disable-line react/prop-types
    try {
      await store.dispatch(getContent({ path }));
      const data = selectContent(store.getState(), { path });
      if (!data || !data.content) {
        return undefined;
      }
      return {
        title: data.title,
        component: <Layout><Content path={path} /></Layout>,
      };
    } catch (e) {
      throw new Error(e);
    }
  },

};
