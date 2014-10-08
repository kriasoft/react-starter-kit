var __path__ = '../../src/components/Navbar.jsx';

jest.dontMock(__path__);

describe('NavBar', function() {
  it('sets class name', function() {
    var React = require('react/addons')
    var TestUtils = React.addons.TestUtils;

    var NavBar = require(__path__);
    var Component = TestUtils.renderIntoDocument(<NavBar />);

    var element = TestUtils.findRenderedDOMComponentWithClass(Component, 'navbar-top');
    expect(element).toBeDefined();
  });
});