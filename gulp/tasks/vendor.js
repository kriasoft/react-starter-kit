/*!
 * Facebook React Starter Kit | https://github.com/kriasoft/react-starter-kit
 * Copyright (c) KriaSoft, LLC. All rights reserved. See LICENSE.txt
 */

var gulp = require('gulp');
var config = require('../config');

// 3rd party libraries
gulp.task('vendor', function() {
  return gulp.src(config.vendor.src)
    .pipe(gulp.dest(config.vendor.dest));
});
