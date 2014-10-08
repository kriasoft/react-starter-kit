'use strict';

var ReactTools = require('react-tools');

module.exports = {
  process: function(src, path) {
    return ReactTools.transform(
      path.match(/\.jsx$/) ? '/**@jsx React.DOM*/' + src : src,
      {harmony: true});
  }
};
