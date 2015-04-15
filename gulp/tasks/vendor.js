'use strict';

var gulp = require('gulp');

gulp.task('vendor', function() {
  return gulp.src('node_modules/bootstrap/dist/fonts/**')
    .pipe(gulp.dest('build/fonts'));
});
