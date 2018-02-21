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

import Feedback from './Feedback';

describe('<Feedback />', () => {
  const wrapper = shallow(<Feedback.ComposedComponent />);

  it('renders children correctly', () => {
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
