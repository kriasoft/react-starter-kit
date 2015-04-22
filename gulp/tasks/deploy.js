/*!
 * Facebook React Starter Kit | https://github.com/kriasoft/react-starter-kit
 * Copyright (c) KriaSoft, LLC. All rights reserved. See LICENSE.txt
 */

var gulp = require('gulp');
var argv = require('minimist')(process.argv.slice(2));

// Deploy via Git
gulp.task('deploy', function(cb) {
  var push = require('git-push');
  var remote = argv.production ?
    'https://github.com/{user}/{repo}.git' :
    'https://github.com/{user}/{repo}-test.git';
  push('./build', remote, cb);
});
