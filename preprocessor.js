'use strict';

var to5 = require('6to5-core');

module.exports = {
  process: function(src, filename) {
    // Ignore files other than .js, .es, .jsx or .es6
    if (!to5.canCompile(filename)) {
      return '';
    }
    // Ignore all files within node_modules
    if (filename.indexOf('node_modules') === -1) {
      return to5.transform(src, { filename: filename }).code;
    }
    return src;
  }
};
