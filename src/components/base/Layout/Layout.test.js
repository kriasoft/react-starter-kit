/* eslint-env jest */
/* eslint-disable padded-blocks, no-unused-expressions */

import React from 'react';
import configureStore from 'redux-mock-store';
import { mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import thunk from 'redux-thunk';

import App from '../../App';
import Layout from './Layout';

const middlewares = [thunk];
const mockStore = configureStore(middlewares);
const initialState = {};

describe('<Layout />', () => {
  test('renders children correctly', () => {
    const store = mockStore(initialState);
    const wrapper = mount(
      <App
        context={{
          pathname: '',
          baseUrl: '',
          insertCss: () => {},
          fetch: () => {},
          store,
        }}
      >
        <Layout>
          <div className="child" />
        </Layout>
      </App>,
    );

    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
