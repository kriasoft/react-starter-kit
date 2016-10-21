/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

/* eslint-env mocha */
/* eslint-disable padded-blocks, no-unused-expressions */

import React from 'react';
import { expect } from 'chai';
import { render } from 'enzyme';
import App from '../App';
import Layout from './Layout';
import reducer from '../../reducers';

function createStoreMock() {
  const initialState = {
    runtime: {
      availableLocales: ['en-US'],
    },
    intl: {
      locale: 'en-US',
    }
  };
  const state = reducer(initialState, { type: '@@TEST' });
  return {
    getState() {
      return state;
    },

    subscribe() {},

    dispatch() {},
  };
}

describe('Layout', () => {
  it('renders children correctly', () => {
    const store = createStoreMock();
    const wrapper = render(
      <App context={{ insertCss: () => {}, store }}>
        <Layout>
          <div className="child" />
        </Layout>
      </App>
    );
    expect(wrapper.find('div.child').length).to.eq(1);
  });

});
