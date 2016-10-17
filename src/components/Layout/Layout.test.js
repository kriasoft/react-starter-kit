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
import { shallow } from 'enzyme';
import App from '../App';
import Layout from './Layout';
import configureStore from 'redux-mock-store';

describe('Layout', () => {

  it('renders children correctly', () => {
    const mockStore = configureStore();
    const store = mockStore()

    const wrapper = shallow(
      <App context={{ insertCss: () => {}, store }}>
        <Layout>
          <div className="child" />
        </Layout>
      </App>
    );

    expect(wrapper.contains(<div className="child" />)).to.be.true;
  });

});
