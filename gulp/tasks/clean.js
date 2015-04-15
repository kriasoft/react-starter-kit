'use strict';

var gulp = require('gulp');
var del = require('del');

gulp.task('clean', del.bind(
  null, ['.tmp', 'build/*', '!build/.git'], {dot: true}
));
