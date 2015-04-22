/*!
 * Facebook React Starter Kit | https://github.com/kriasoft/react-starter-kit
 * Copyright (c) KriaSoft, LLC. All rights reserved. See LICENSE.txt
 */

var gulp = require('gulp');
var webpack = require('webpack');
var $ = require('gulp-load-plugins')();
var config = require('../config');
var argv = require('minimist')(process.argv.slice(2));

// Bundle
gulp.task('bundle', function(cb) {
  var started = false;
  var config = require('../../webpack.config.js');
  var bundler = webpack(config);

  function bundle(err, stats) {
    if (err) {
      throw new $.util.PluginError('webpack', err);
    }

    if (argv.verbose) {
      $.util.log('[webpack]', stats.toString({colors: true}));
    }

    if (!started) {
      started = true;
      return cb();
    }
  }

  if (config.watch) {
    bundler.watch(200, bundle);
  } else {
    bundler.run(bundle);
  }
});
