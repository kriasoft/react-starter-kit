var ReactTools = require('react-tools');

module.exports = {
  process: function(src, path) {
    if (path.match(/\.jsx?$/)) {
      src = ReactTools.transform('/** @jsx React.DOM */' + src, {harmony: true});
    } else src = '';

    return src;
  }
};