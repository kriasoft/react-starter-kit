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
import createApolloClient from '../../core/createApolloClient';
import App from '../App';
import Layout from './Layout';

describe('Layout', () => {
  test('renders children correctly', () => {
    const client = createApolloClient();

    const wrapper = renderer
      .create(
        <App
          context={{
            insertCss: () => {},
            // fetch: () => {},
            pathname: '',
            client,
          }}
        >
          <Layout>
            <div className="child" />
          </Layout>
        </App>,
      )
      .toJSON();

    expect(wrapper).toMatchSnapshot();
  });
});
