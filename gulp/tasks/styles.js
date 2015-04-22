/*!
 * Facebook React Starter Kit | https://github.com/kriasoft/react-starter-kit
 * Copyright (c) KriaSoft, LLC. All rights reserved. See LICENSE.txt
 */

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var config = require('../config');

// CSS style sheets
gulp.task('styles', function() {

  return gulp.src(config.styles.src)
    .pipe($.plumber())
    .pipe($.less({
      sourceMap: !config.RELEASE,
      sourceMapBasepath: __dirname
    }))
    .on('error', console.error.bind(console))
    .pipe($.autoprefixer({browsers: config.AUTOPREFIXER_BROWSERS}))
    .pipe($.csscomb())
    .pipe($.if(config.RELEASE, $.minifyCss()))
    .pipe(gulp.dest(config.styles.dest))
    .pipe($.size({title: 'styles'}));
});
