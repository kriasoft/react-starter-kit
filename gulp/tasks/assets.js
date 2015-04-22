/*!
 * Facebook React Starter Kit | https://github.com/kriasoft/react-starter-kit
 * Copyright (c) KriaSoft, LLC. All rights reserved. See LICENSE.txt
 */

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var config = require('../config');

// Static files
gulp.task('assets', function() {

  return gulp.src(config.assets.src)
    .pipe($.changed(config.assets.dest))
    .pipe(gulp.dest(config.assets.dest))
    .pipe($.size({title: 'assets'}));
});
