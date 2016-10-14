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
import { getLocaleContent } from '../../actions/content';

export default {

  path: '*',

  async action({ path, locale, store }) { // eslint-disable-line react/prop-types
    try {
      await store.dispatch(getLocaleContent(path, locale));
      const data = store.getState().content.data;
      if (!data || !data.content) {
        return undefined;
      }
    } catch (e) {
      throw new Error(e);
    }
    return {
      title: store.getState().content.data.title,
      component: <Content path={path} />,
    };
  },

};
