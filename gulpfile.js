// For more information on how to configure Gulp.js build system, please visit:
// https://github.com/gulpjs/gulp/blob/master/docs/API.md

var es = require('event-stream');
var gulp = require('gulp');
var changed = require('gulp-changed');
var embedlr = require('gulp-embedlr');
var htmlmin = require('gulp-htmlmin');
var jshint = require('gulp-jshint');
var less = require('gulp-less');
var minifyCSS = require('gulp-minify-css');
var plumber = require('gulp-plumber');
var uglify = require('gulp-uglify');
var gutil = require('gulp-util');
var path = require('path');
var rimraf = require('rimraf');
var webpack = require('webpack');

// Settings
var isDebug = !require('minimist')(process.argv.slice(2)).production;
var compiler = webpack(require('./config/webpack.config.js')(isDebug));

// A cache for Gulp tasks. It is used as a workaround for Gulp's dependency resolution
// limitations. It won't be needed anymore starting with Gulp 4.
var task = {};

// Clean up
gulp.task('clean', function (cb) {
    rimraf('./build', cb);
});

// Copy vendor files
// -----------------------------------------------------------------------------
gulp.task('vendor', task.vendor = function () {
    var pkg = require('./bower.json').dependencies;
    return es.concat(
        gulp.src('./bower_components/jquery/dist/**')
            .pipe(gulp.dest('./build/vendor/jquery-' + pkg.jquery.substring(1))),
        gulp.src('./bower_components/bootstrap/dist/fonts/**')
            .pipe(gulp.dest('./build/fonts'))
    );
});
gulp.task('vendor:clean', ['clean'], task.vendor);

// Copy static files / assets
// -----------------------------------------------------------------------------
gulp.task('assets', task.assets = function () {
    return es.concat(
        gulp.src('./src/assets/**')
            .pipe(gulp.dest('./build')),
        gulp.src('./src/images/**')
            .pipe(gulp.dest('./build/images/')),
        gulp.src('./src/*.html')
            .pipe(isDebug ? gutil.noop() : htmlmin({
                removeComments: true,
                collapseWhitespace: true,
                minifyJS: true
            }))
            .pipe(isDebug ? embedlr() : gutil.noop())
            .pipe(gulp.dest('./build'))
    );
});
gulp.task('assets:clean', ['clean'], task.assets);

// CSS stylesheets
// -----------------------------------------------------------------------------
gulp.task('styles', task.styles = function () {
    return gulp.src('./src/app.less')
        .pipe(plumber())
        .pipe(less({sourceMap: isDebug, sourceMapBasepath: __dirname}))
        .on('error', gutil.log)
        .pipe(isDebug ? gutil.noop() : minifyCSS())
        .pipe(gulp.dest('./build'));
});
gulp.task('styles:clean', ['clean'], task.styles);

// Create JavaScript bundle
// -----------------------------------------------------------------------------
gulp.task('bundle', ['clean'], function (cb) {
    compiler.run(function (err, stats) {
        if (err) {
            throw new gutil.PluginError('webpack', err);
        }
        gutil.log('[webpack]', stats.toString({colors: true}));
        cb();
    });
});
gulp.task('bundle:watch', ['clean'], function (cb) {
    compiler.watch(200, function (err, stats) {
        if (err) {
            throw new gutil.PluginError('webpack', err);
        }
        gutil.log('[webpack]', stats.toString({colors: true}));
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
    var port = 8080;

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
            gutil.log('Server is listening on ' + gutil.colors.magenta('http://localhost:' + port + '/'));
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
        gutil.log('File changed: ' + gutil.colors.magenta(relPath));
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