'use strict';

var gulp = require('gulp');
var config = require('../config').pagespeed;

// Run PageSpeed Insights
gulp.task('pagespeed', function(cb) {
  var pagespeed = require('psi');
  // Update the below URL to the public URL of your site
  pagespeed.output(config.url, {
    strategy: config.stategy
    // By default we use the PageSpeed Insights free (no API key) tier.
    // Use a Google Developer API key if you have one: http://goo.gl/RkN0vE
    // key: config.YOUR_API_KEY
  }, cb);
});
