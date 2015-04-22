/*!
 * Facebook React Starter Kit | https://github.com/kriasoft/react-starter-kit
 * Copyright (c) KriaSoft, LLC. All rights reserved. See LICENSE.txt
 */

var gulp = require('gulp');
var config = require('../config');
var path = require('path');

var browserSync = config.browserSync;

// Launch BrowserSync development server
gulp.task('sync', ['serve'], function(cb) {
  browserSync = require('browser-sync');

  browserSync({
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
    browserSync.exit();
  });

  gulp.watch([config.server.watch].concat(
    config.server.src.map(function(file) { return '!' + file; })
  ), function(file) {
    browserSync.reload(path.relative(__dirname, file.path));
  });
});
