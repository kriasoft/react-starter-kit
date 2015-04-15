'use strict';

var gulp = require('gulp');
var runSequence = require('run-sequence');
var config = require('../config');
var globalVars = require('../globalVars');

// Build the app from source code
gulp.task('build', ['clean'], function(cb) {
  runSequence(['vendor', 'assets', 'styles', 'bundle'], cb);
});

// Build and start watching for modifications
gulp.task('build:watch', function(cb) {
  globalVars.watch = true;
  runSequence('build', function() {
    gulp.watch(config.assets, ['assets']);
    gulp.watch(config.styles, ['styles']);
    cb();
  });
});
