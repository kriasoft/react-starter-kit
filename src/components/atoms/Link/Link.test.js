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

// mock history dependency
import history from '../../../history';

jest.mock('../../../history', () => ({
  push: jest.fn(),
}));

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

  it('renders href without baseUrl correctly', () => {
    expect(wrapper.find('a').prop('href')).toBe('/internal-link');
  });

  it('renders href with baseUrl correctly', () => {
    wrapper.setContext({ baseUrl: '/base-url' });
    expect(wrapper.find('a').prop('href')).toBe('/base-url/internal-link');
  });

  it('renders text correctly', () => {
    expect(wrapper.text()).toBe('Internal Link');
  });

  it('renders children correctly', () => {
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  describe('handles click', () => {
    const event = { button: 0, preventDefault: jest.fn() };

    it('does not trigger history push on non leftClick', () => {
      wrapper.find('a').simulate('click', { button: 2 });
      expect(history.push).not.toHaveBeenCalled();
    });

    it('does not call history.push when default is prevented', () => {
      wrapper
        .find('a')
        .simulate('click', { button: 0, defaultPrevented: true });
      expect(history.push).not.toHaveBeenCalled();
    });

    it('calles custom onClick', () => {
      const onClick = jest.fn();
      wrapper.setProps({ onClick });
      wrapper.find('a').simulate('click', event);
      expect(onClick).toHaveBeenCalled();
    });

    it('triggers history.push correctly', () => {
      wrapper.find('a').simulate('click', event);
      expect(history.push).toHaveBeenCalledWith('/base-url/internal-link');
    });
  });
});
