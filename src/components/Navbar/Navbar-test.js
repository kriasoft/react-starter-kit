/*
 * React.js Starter Kit
 * Copyright (c) 2014 Konstantin Tarkus (@koistya), KriaSoft LLC.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

/* global describe, it */

'use strict';

import { jsdom } from 'jsdom';

if (typeof document === 'undefined') {
  global.document = jsdom('<html><body></body></html>');
  global.window = document.defaultView;
  global.navigator = {userAgent: 'node.js'};
}

describe('components/Navbar', function() {

  it('should contain a DOM element with CSS class "navbar-top"', function() {
    // Arrange
    var React = require('react/addons');
    var TestUtils = React.addons.TestUtils;
    var Navbar = require('../Navbar');

    // Act
    var Component = TestUtils.renderIntoDocument(React.createElement(Navbar));

    // Assert
    TestUtils.findRenderedDOMComponentWithClass(Component, 'navbar-top');
  });

});
