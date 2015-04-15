'use strict';

var gulp = require('gulp');
var $ = require('../util/load-plugin');
var config = require('../config');
var RELEASE = !!require('./arguments').release;

// CSS style sheets
gulp.task('styles', function () {
  return gulp.src('src/styles/bootstrap.less')
    .pipe($.plumber())
    .pipe($.less({
      sourceMap: !RELEASE,
      sourceMapBasepath: __dirname
    }))
    .on('error', console.error.bind(console))
    .pipe($.autoprefixer(config.autoprefixer))
    .pipe($.csscomb())
    .pipe($.if(RELEASE, $.minifyCss()))
    .pipe(gulp.dest('build/css'))
    .pipe($.size({title: 'styles'}));
});
