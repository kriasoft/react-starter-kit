/*!
 * Facebook React Starter Kit | https://github.com/kriasoft/react-starter-kit
 * Copyright (c) KriaSoft, LLC. All rights reserved. See LICENSE.txt
 */

var gulp = require('gulp');
var runSequence = require('run-sequence');
var config = require('../config');

// Build and start watching for modifications
gulp.task('build:watch', function(cb) {
  watch = true;
  runSequence('build', function() {
    gulp.watch(config.assets.src, ['assets']);
    gulp.watch(config.styles.all, ['styles']);
    cb();
  });
});
