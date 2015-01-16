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
var pagespeed = require('psi');
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
    .pipe($.imagemin({
      progressive: true,
      interlaced: true
    }))
    .pipe(gulp.dest(DEST + '/images'))
    .pipe($.size({title: 'images'}));
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
  runSequence(['vendor', 'assets', 'images', 'styles', 'bundle'], cb);
});

// Launch a lightweight HTTP Server
gulp.task('serve', function(cb) {

  var nodemon = require('nodemon');
  var browserSync = require('browser-sync');

  watch = true;

  runSequence('build', function() {

    var server = require('nodemon')({
      script: 'src/server.js',
      watch: [path.join(__dirname, 'src/**/*.js')],
      env: {NODE_ENV: 'development'}
    }).on('log', function(log) {
      $.util.log('nodemon', $.util.colors.green(log.message));
    }).on('crash', function() {
      $.util.log($.util.colors.red('nodemon crashed'));
    }).once('start', function() {
      browserSync({
        notify: false,
        // Customize the BrowserSync console logging prefix
        logPrefix: 'QC',
        // Run as an https by setting 'https: true'
        // Note: this uses an unsigned certificate which on first access
        //       will present a certificate warning in the browser.
        https: false,
        // Informs browser-sync to proxy our Express app which would run
        // at the following location
        proxy: 'http://localhost:5000'
      });

      process.on('exit', function () {
        browserSync.exit();
        server.emit('exit');
      });

      gulp.watch(src.assets, ['assets']);
      gulp.watch(src.images, ['images']);
      gulp.watch(src.styles, ['styles']);
      gulp.watch(DEST + '/**/*.*', function (file) {
        browserSync.reload(path.relative(__dirname, file.path));
      });
      cb();
    });
  });
});

// Deploy to GitHub Pages
gulp.task('deploy', function() {

  // Remove temp folder
  if (argv.clean) {
    var os = require('os');
    var path = require('path');
    var repoPath = path.join(os.tmpdir(), 'tmpRepo');
    $.util.log('Delete ' + $.util.colors.magenta(repoPath));
    del.sync(repoPath, {force: true});
  }

  return gulp.src(DEST + '/**/*')
    .pipe($.if('**/robots.txt', !argv.production ? $.replace('Disallow:', 'Disallow: /') : $.util.noop()))
    .pipe($.ghPages({
      remoteUrl: 'https://github.com/{name}/{name}.github.io.git',
      branch: 'master'
    }));
});

// Run PageSpeed Insights
gulp.task('pagespeed', function(cb) {
  // Update the below URL to the public URL of your site
  pagespeed.output('example.com', {
    strategy: 'mobile'
    // By default we use the PageSpeed Insights free (no API key) tier.
    // Use a Google Developer API key if you have one: http://goo.gl/RkN0vE
    // key: 'YOUR_API_KEY'
  }, cb);
});
