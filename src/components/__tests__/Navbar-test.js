/* global jest, describe, it, expect */

'use strict';

jest.dontMock('../Navbar');

describe('Navbar', function() {
  it('sets class name', function() {
    var React = require('react/addons');
    var TestUtils = React.addons.TestUtils;

    var Navbar = require('../Navbar');
    var Component = TestUtils.renderIntoDocument(<Navbar />);

    var element = TestUtils.findRenderedDOMComponentWithClass(Component, 'navbar-top');
    expect(element).toBeDefined();
  });
});
