'use strict';

var gulp = require('gulp');
var webpack = require('webpack');
var $ = require('../util/load-plugin');
var argv = require('./arguments');
var globalVars = require('../globalVars');

// Bundle
gulp.task('bundle', function(cb) {
  var started = false;
  var config = require('../config').webpack;
  var bundler = webpack(config);

  function bundle(err, stats) {
    if (err) {
      throw new $.PluginError('webpack', err);
    }

    if (argv.verbose) {
      $.log('[webpack]', stats.toString({colors: true}));
    }

    if (!started) {
      started = true;
      return cb();
    }
  }

  if (globalVars.watch) {
    bundler.watch(200, bundle);
  } else {
    bundler.run(bundle);
  }
});
