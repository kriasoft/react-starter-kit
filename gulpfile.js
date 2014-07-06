/*!
 * Facebook React Starter Kit | https://github.com/kriasoft/React-Seed
 * Copyright (c) KriaSoft, LLC. All rights reserved. See LICENSE.txt
 */

/*
 * For more information on how to configure Gulp, please visit:
 * https://github.com/gulpjs/gulp/blob/master/docs/API.md
 */

// Include Gulp & other tools for build automation
var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var es = require('event-stream');
var path = require('path');
var rimraf = require('rimraf');
var webpack = require('webpack');
var argv = require('minimist')(process.argv.slice(2));

// Settings
var DEBUG = !argv.release;
var WATCH = Boolean(argv.watch);

var pkgs = require('./package.json').dependencies;
Object.keys(pkgs).forEach(function (key) { return pkgs[key] = pkgs[key].substring(1); });
var bundler = webpack(require('./config/webpack.config.js')(DEBUG));


// A cache for Gulp tasks. It is used as a workaround for Gulp's dependency resolution
// limitations. It won't be needed anymore starting with Gulp 4.
var task = {};

// Clean up
// -----------------------------------------------------------------------------
gulp.task('clean', function (cb) {
    rimraf('./build', cb);
});

// Copy vendor files
// -----------------------------------------------------------------------------
gulp.task('vendor', task.vendor = function () {
    return es.merge(
        gulp.src('./node_modules/jquery/dist/**')
            .pipe(gulp.dest('./build/vendor/jquery-' + pkgs.jquery)),
        gulp.src('./node_modules/bootstrap/dist/fonts/**')
            .pipe(gulp.dest('./build/fonts'))
    );
});
gulp.task('vendor:clean', ['clean'], task.vendor);

// Copy static files / assets
// -----------------------------------------------------------------------------
gulp.task('assets', task.assets = function () {
    return es.merge(
        gulp.src('./src/assets/**')
            .pipe(gulp.dest('./build')),
        gulp.src('./src/images/**')
            .pipe(gulp.dest('./build/images/')),
        gulp.src('./src/*.html')
            .pipe(DEBUG ? $.util.noop() : $.htmlmin({
                removeComments: true,
                collapseWhitespace: true,
                minifyJS: true
            }))
            .pipe(DEBUG ? $.embedlr() : $.util.noop())
            .pipe(gulp.dest('./build'))
    );
});
gulp.task('assets:clean', ['clean'], task.assets);

// CSS stylesheets
// -----------------------------------------------------------------------------
gulp.task('styles', task.styles = function () {
    return gulp.src('./src/styles/bootstrap.less')
        .pipe($.plumber())
        .pipe($.less({sourceMap: DEBUG, sourceMapBasepath: __dirname}))
        .on('error', $.util.log)
        .pipe(DEBUG ? $.util.noop() : $.minifyCss())
        .pipe(gulp.dest('./build/css'));
});
gulp.task('styles:clean', ['clean'], task.styles);

// Create JavaScript bundle
// -----------------------------------------------------------------------------
gulp.task('bundle', ['clean'], function (cb) {
    bundler.run(function (err, stats) {
        if (err) {
            throw new $.util.PluginError('webpack', err);
        }
        $.util.log('[webpack]', stats.toString({colors: true}));
        cb();
    });
});
gulp.task('bundle:watch', ['clean'], function (cb) {
    bundler.watch(200, function (err, stats) {
        if (err) {
            throw new $.util.PluginError('webpack', err);
        }
        $.util.log('[webpack]', stats.toString({colors: true}));
        if (cb) {
            cb();
            cb = null;
        }
    });
});

// Build the app from source code
// -----------------------------------------------------------------------------
gulp.task('build', ['vendor:clean', 'assets:clean', 'styles:clean', 'bundle']);
gulp.task('build:watch', ['vendor:clean', 'assets:clean', 'styles:clean', 'bundle:watch']);

// Launch a lightweight HTTP Server
// -----------------------------------------------------------------------------
gulp.task('run', ['build:watch'], function (next) {
    var url = require('url');
    var server = require('ecstatic')({root: './', cache: 'no-cache', showDir: true});
    var port = 3000;

    require('http').createServer()
        .on('request', function (req, res) {
            // For non-existent files output the contents of /index.html page in order to make HTML5 routing work
            var urlPath = url.parse(req.url).pathname;
            if (urlPath === '/') {
                req.url = '/build/index.html';
            } else if (['src', 'bower_components'].indexOf(urlPath.split('/')[1]) === -1) {
                if (urlPath.length > 3 &&
                    ['src', 'bower_components'].indexOf(urlPath.split('/')[1]) === -1 &&
                    ['css', 'html', 'ico', 'js', 'png', 'txt', 'xml'].indexOf(urlPath.split('.').pop()) == -1 &&
                    ['fonts', 'images', 'vendor', 'views'].indexOf(urlPath.split('/')[1]) == -1) {
                    req.url = '/build/index.html';
                } else {
                    req.url = '/build' + req.url;
                }
            }
            server(req, res);
        })
        .listen(port, function () {
            $.util.log('Server is listening on ' + $.util.colors.magenta('http://localhost:' + port + '/'));
            next();
        });
});

// Watch for changes in source files
// -----------------------------------------------------------------------------
gulp.task('watch', ['run'], function () {
    var path = require('path');
    var lr = require('gulp-livereload');

    // Watch for changes in source files
    gulp.watch('./src/assets/**', ['assets']);
    gulp.watch('./src/**/*.less', ['styles']);

    // Watch for changes in 'compiled' files
    gulp.watch('./build/**', function (file) {
        var relPath = 'build\\' + path.relative('./build', file.path);
        $.util.log('File changed: ' + $.util.colors.magenta(relPath));
        lr.changed(file.path);
    });

    lr.listen();
});

// Deploy to GitHub Pages. See: https://pages.github.com
// -----------------------------------------------------------------------------
gulp.task('deploy', ['build'], function (cb) {
    var url = 'https://github.com/{name}/{name}.github.io.git';
    var exec = require('child_process').exec;
    var cwd = path.join(__dirname, './build');
    var cmd = 'git init && git remote add origin ' + url + ' && ' +
              'git add . && git commit -m Release && ' +
              'git push -f origin master';

    exec(cmd, { 'cwd': cwd }, function (err, stdout, stderr) {
        if (err !== null) {
            cb(err);
        } else {
            gutil.log(stdout, stderr);
            cb();
        }
    });
});

// The default task
gulp.task('default', ['watch']);