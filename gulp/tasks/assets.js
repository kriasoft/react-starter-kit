'use strict';

var gulp = require('gulp');
var $ = require('../util/load-plugin');
var config = require('../config');

// Static files
gulp.task('assets', function() {
  return gulp.src(config.assets)
    .pipe($.changed('build'))
    .pipe(gulp.dest('build'))
    .pipe($.size({title: 'assets'}));
});
