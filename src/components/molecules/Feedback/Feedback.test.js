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
