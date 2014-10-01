'use strict';

var React = require('react');

// Export React so the dev tools can find it
(window !== window.top ? window.top : window).React = React;

var Routes = require('./Routes.jsx')

React.renderComponent(Routes, document.body)
