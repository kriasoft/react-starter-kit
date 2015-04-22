/*!
 * Facebook React Starter Kit | https://github.com/kriasoft/react-starter-kit
 * Copyright (c) KriaSoft, LLC. All rights reserved. See LICENSE.txt
 */

var fs = require('fs');
var path = require('path');

// Make sure that only .js files are included as tasks
var onlyJs = function(fileName) {
  return /(\.(js)$)/i.test(path.extname(fileName));
};

// Read gulp/tasks directory and check for .js files
var tasks = fs.readdirSync('./gulp/tasks/').filter(onlyJs);

tasks.forEach(function(task) {
  require('./tasks/' + task);
});
