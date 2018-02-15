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
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import App from '../../App';
import Link from './Link';

const middlewares = [thunk];
const mockStore = configureStore(middlewares);
const initialState = {};

const store = mockStore(initialState);

const url = '/internalpage';
const linkContent = 'Internal Page';

const context = {
  pathname: '',
  baseUrl: '',
  insertCss: () => {},
  fetch: () => {},
  store,
};

const component = (
  <App context={context}>
    <Link to={url}>{linkContent}</Link>
  </App>
);

describe('<Link />', () => {
  test('renders correctly', () => {
    const output = renderer.create(component).toJSON();
    expect(output).toMatchSnapshot();
  });

  test('renders linkcontent correctly', () => {
    const output = renderer.create(component).toJSON();
    expect(output.children).toContain(linkContent);
  });

  test('renders href without baseUrl correctly', () => {
    context.baseUrl = '/test';
    const output = renderer.create(component).toJSON();
    expect(output.props.href).toEqual(`${context.baseUrl}${url}`);
  });
});
