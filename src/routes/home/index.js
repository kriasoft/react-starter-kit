/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import Home from './Home';
import fetch from '../../core/fetch';
import Layout from '../../components/Layout';

export default {

  path: '/',

  async action() {
    // const resp = await fetch('/graphql', {
    //   method: 'post',
    //   headers: {
    //     Accept: 'application/json',
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({
    //     query: '{news{title,link,contentSnippet}}',
    //   }),
    //   credentials: 'include',
    // });
    // const { data } = await resp.json();
    let data = {}
    data.news = [
      {title:'张三',uid:'1',description:'四姓18家'},
      {title:'李四',uid:'2',description:'四姓18家'},
      {title:'王五',uid:'3',description:'四姓18家'},
      {title:'赵六',uid:'4',description:'四姓18家'}];
    if (!data || !data.news) throw new Error('Failed to load the news feed.');
    return {
      title: '微信',
      component: <Layout><Home news={data.news} /></Layout>,
    };
  },

};
