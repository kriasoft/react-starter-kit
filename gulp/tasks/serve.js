'use strict';

var gulp = require('gulp');
var $ = require('../util/load-plugin');
var config = require('../config');
var globalVars = require('../globalVars');


// Launch a Node.js/Express server
gulp.task('serve', ['build:watch'], function(cb) {

  var started = false;
  var cp = require('child_process');
  var assign = require('react/lib/Object.assign');

  var server = (function startup() {
    var child = cp.fork('build/server.js', {
      env: assign({NODE_ENV: 'development'}, process.env)
    });
    child.once('message', function(message) {
      if (message.match(/^online$/)) {
        if (globalVars.browserSync) {
          globalVars.browserSync.reload();
        }
        if (!started) {
          started = true;
          gulp.watch(config.server, function() {
            $.util.log('Restarting development server.');
            server.kill('SIGTERM');
            server = startup();
          });
          cb();
        }
      }
    });
    return child;
  })();

  process.on('exit', function() {
    server.kill('SIGTERM');
  });
});
