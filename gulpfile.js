/*
 * React.js Starter Kit
 * Copyright (c) 2014 Konstantin Tarkus (@koistya), KriaSoft LLC.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

'use strict';

// Include Gulp and other build automation tools and utilities
// See: https://github.com/gulpjs/gulp/blob/master/docs/API.md
var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var del = require('del');
var path = require('path');
var runSequence = require('run-sequence');
var webpack = require('webpack');
var argv = require('minimist')(process.argv.slice(2));

// Settings
var DEST = './build';                         // The build output folder
var RELEASE = !!argv.release;                 // Minimize and optimize during a build?
var GOOGLE_ANALYTICS_ID = 'UA-XXXXX-X';       // https://www.google.com/analytics/web/
var AUTOPREFIXER_BROWSERS = [                 // https://github.com/ai/autoprefixer
  'ie >= 10',
  'ie_mob >= 10',
  'ff >= 30',
  'chrome >= 34',
  'safari >= 7',
  'opera >= 23',
  'ios >= 7',
  'android >= 4.4',
  'bb >= 10'
];

var src = {};
var watch = false;

// The default task
gulp.task('default', ['serve']);

// Clean up
gulp.task('clean', del.bind(null, [DEST]));

// 3rd party libraries
gulp.task('vendor', function() {
  return gulp.src('./node_modules/bootstrap/dist/fonts/**')
    .pipe(gulp.dest(DEST + '/fonts'));
});

// Static files
gulp.task('assets', function() {
  src.assets = 'src/assets/**';
  return gulp.src(src.assets)
    .pipe($.changed(DEST))
    .pipe(gulp.dest(DEST))
    .pipe($.size({title: 'assets'}));
});

// Images
gulp.task('images', function() {
  src.images = 'src/images/**';
  return gulp.src(src.images)
    .pipe($.changed(DEST + '/images'))
    .pipe(gulp.dest(DEST + '/images'))
    .pipe($.size({title: 'images'}));
});

// Convert application's data to JSON
gulp.task('data', function() {
  src.data = 'data/**/*.jade';

  var through = require('through2');
  var jade = require('jade');
  var assign = require('react/lib/Object.assign');

  return gulp.src(src.data)
    .pipe($.frontMatter({property: 'metadata', remove: true}))
    .pipe($.rename({extname: '.json'}))
    .pipe(through.obj(function(file, enc, cb) {
      console.assert(file.isBuffer());
      var json = JSON.stringify(assign({}, file.metadata, {
        html: jade.render(file.contents.toString(enc))
      }), null, '  ');
      file.contents = new Buffer(json, enc);
      return cb(null, file);
    }))
    .pipe(gulp.dest(DEST + '/api'))
    .pipe($.size({title: 'data'}));
});

// CSS style sheets
gulp.task('styles', function() {
  src.styles = 'src/styles/**/*.{css,less}';
  return gulp.src('src/styles/bootstrap.less')
    .pipe($.plumber())
    .pipe($.less({
      sourceMap: !RELEASE,
      sourceMapBasepath: __dirname
    }))
    .on('error', console.error.bind(console))
    .pipe($.autoprefixer({browsers: AUTOPREFIXER_BROWSERS}))
    .pipe($.csscomb())
    .pipe($.if(RELEASE, $.minifyCss()))
    .pipe(gulp.dest(DEST + '/css'))
    .pipe($.size({title: 'styles'}));
});

// Bundle
gulp.task('bundle', function(cb) {
  var started = false;
  var config = require('./config/webpack.js')(RELEASE);
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

  if (watch) {
    bundler.watch(200, bundle);
  } else {
    bundler.run(bundle);
  }
});

// Build the app from source code
gulp.task('build', ['clean'], function(cb) {
  runSequence(['vendor', 'assets', 'images', 'styles', 'data', 'bundle'], cb);
});

// Launch a lightweight HTTP Server
gulp.task('serve', function(cb) {

  var browserSync = require('browser-sync');

  watch = true;

  function run() {
    var server;
    function start() {
      server = require('child_process').fork(
        './src/server.js',
        {env: {NODE_ENV: 'development'}}
      );
      server.on('error', console.error.bind(null));
      server.on('close', console.log.bind(null, 'Node app exited with code:'));
      server.on('message', function(message) {
        if (message.type === 'start' && !browserSync.active) {
          browserSync({
            notify: false,
            // Customize the BrowserSync console logging prefix
            logPrefix: 'RSK',
            // Run as an https by setting 'https: true'
            // Note: this uses an unsigned certificate which on first access
            //       will present a certificate warning in the browser.
            https: false,
            // Informs browser-sync to proxy our Express app which would run
            // at the following location
            proxy: 'http://localhost:5000'
          });

          gulp.watch(src.assets, ['assets']);
          gulp.watch(src.images, ['images']);
          gulp.watch(src.styles, ['styles']);
          gulp.watch(src.data, ['data']);
          gulp.watch(src.source, ['source', restart]);
          gulp.watch(DEST + '/**/*.*', function(file) {
            browserSync.reload(path.relative(__dirname, file.path));
          });
          cb();
        }
      });
      process.on('exit', exit);
    }

    function exit() {
      server.kill();
    }

    function restart() {
      console.log('Restarting the Node app');
      server.kill();
      start();
    }

    start();
  }

  runSequence('build', run);
});

// Run PageSpeed Insights
// Update `url` below to the public URL for your site
gulp.task('pagespeed', function() {
  return require('psi')({
    // By default, we use the PageSpeed Insights
    // free (no API key) tier. You can use a Google
    // Developer API key if you have one. See
    // http://goo.gl/RkN0vE for info key: 'YOUR_API_KEY'
    url: 'https://example.com',
    strategy: 'mobile'
  });
});
