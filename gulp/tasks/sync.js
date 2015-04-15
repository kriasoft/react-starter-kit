'use strict';

var gulp = require('gulp');
var globalVars = require('../globalVars');
var config = require('../config');


// Launch BrowserSync development server
gulp.task('sync', ['serve'], function(cb) {
  globalVars.browserSync = require('browser-sync');

  globalVars.browserSync({
    logPrefix: 'RSK',
    notify: false,
    // Run as an https by setting 'https: true'
    // Note: this uses an unsigned certificate which on first access
    //       will present a certificate warning in the browser.
    https: false,
    // Informs browser-sync to proxy our Express app which would run
    // at the following location
    proxy: 'localhost:5000'
  }, cb);

  process.on('exit', function() {
    globalVars.browserSync.exit();
  });

  gulp.watch(['build/**/*.*'].concat(
    config.server.map(function(file) {return '!' + file;})
  ), function(file) {
    globalVars.browserSync.reload(path.relative(__dirname, file.path));
  });
});
