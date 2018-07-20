/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

/* eslint-env jest */
/* eslint-disable padded-blocks, no-unused-expressions */

import React from 'react';
import renderer from 'react-test-renderer';
import App from '../App';
import Layout from '../Layout';
import Page from './Page';
import { defaultColumnData } from '../../../tools/lib/columns';

describe('Page', () => {
  let about = {};
  let columnData = {};
  beforeEach(() => {
    about = {
      title: 'About Us',
      component: 'ContentPage',
      key: 'about',
      html:
        '<p>Lorem ipsum dolor sit amet, consectetur adipisc…or arcu eget arcu. Vestibulum vel quam enim.</p>',
    };
    columnData = {
      leftColumnTitle: 'Whoa, a title!',
      leftColumnHtml: '<p>You will never escape me!</p>',
      rightColumnTitle: 'The correct column title',
      rightColumnHtml: '<ul><li>A list with one item</li></ul>',
    };
  });
  test('renders page without columns correctly', () => {
    const wrapper = renderer.create(
      <App context={{ insertCss: () => {}, fetch: () => {}, pathname: '' }}>
        <Layout>
          <Page {...about} />
        </Layout>
      </App>,
    );
    expect(wrapper).toMatchSnapshot();
  });
  test('renders multi column page correctly', () => {
    Object.assign(about, defaultColumnData, columnData);
    const wrapper = renderer.create(
      <App context={{ insertCss: () => {}, fetch: () => {}, pathname: '' }}>
        <Layout>
          <Page {...about} />
        </Layout>
      </App>,
    );
    expect(wrapper).toMatchSnapshot();
  });
  test('renders left column page correctly', () => {
    delete columnData.rightColumnHtml;
    delete columnData.rightColumnTitle;
    Object.assign(about, defaultColumnData, columnData);
    const wrapper = renderer.create(
      <App context={{ insertCss: () => {}, fetch: () => {}, pathname: '' }}>
        <Layout>
          <Page {...about} />
        </Layout>
      </App>,
    );
    expect(wrapper).toMatchSnapshot();
  });
  test('renders right column page correctly', () => {
    delete columnData.leftColumnHtml;
    delete columnData.leftColumnTitle;
    Object.assign(about, defaultColumnData, columnData);
    const wrapper = renderer.create(
      <App context={{ insertCss: () => {}, fetch: () => {}, pathname: '' }}>
        <Layout>
          <Page {...about} />
        </Layout>
      </App>,
    );
    expect(wrapper).toMatchSnapshot();
  });
});
