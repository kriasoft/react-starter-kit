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
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';

import Link from './Link';

describe('<Link />', () => {
  const props = {
    to: '/internal-link',
    children: ['Internal Link'],
  };

  const wrapper = shallow(<Link {...props} />, {
    context: {
      baseUrl: '',
    },
  });

  test('renders href without baseUrl correctly', () => {
    expect(wrapper.find('a').prop('href')).toBe('/internal-link');
  });

  test('renders href with baseUrl correctly', () => {
    wrapper.setContext({ baseUrl: '/base-url' });
    expect(wrapper.find('a').prop('href')).toBe('/base-url/internal-link');
  });

  test('renders text correctly', () => {
    expect(wrapper.text()).toBe('Internal Link');
  });

  test('renders children correctly', () => {
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
