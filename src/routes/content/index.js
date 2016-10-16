/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import Content from './Content';
import { getContent } from '../../actions/content';

export default {

  path: '*',

  async action({ path, locale, store }) { // eslint-disable-line react/prop-types
    try {
      await store.dispatch(getContent({ path, locale }));
      const data = store.getState().content[`${locale}:${path}`];
      if (!data || !data.content) {
        return undefined;
      }
      return {
        title: data.title,
        component: <Content path={path} />,
      };
    } catch (e) {
      throw new Error(e);
    }
  },

};
