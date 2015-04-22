/*!
 * Facebook React Starter Kit | https://github.com/kriasoft/react-starter-kit
 * Copyright (c) KriaSoft, LLC. All rights reserved. See LICENSE.txt
 */

var argv = require('minimist')(process.argv.slice(2));
var browserSync;

module.exports = {

  'watch' : false,
  browserSync: browserSync,

  'RELEASE': !!argv.release,                 // Minimize and optimize during a build?
  'AUTOPREFIXER_BROWSERS': [                 // https://github.com/ai/autoprefixer
    'ie >= 10',
    'ie_mob >= 10',
    'ff >= 30',
    'chrome >= 34',
    'safari >= 7',
    'opera >= 23',
    'ios >= 7',
    'android >= 4.4',
    'bb >= 10'
  ],

  'server': {
    'watch' : 'build/**/*.*',
    'src' : [
      'build/server.js',
      'build/content/**/*',
      'build/templates/**/*'
    ],
    'dest': 'build/server.js'
  },

  'assets' : {
    'src': [
      'package.json',
      'src/assets/**',
      'src/content*/**/*.*',
      'src/templates*/**/*.*'
    ],
    'dest': 'build'
  },

  'styles' : {
    'all'  : 'src/styles/**/*.{css,less}',
    'src'     : 'src/styles/bootstrap.less',
    'dest'    : 'build/css'
  },

  'vendor' : {
    'src'   : 'node_modules/bootstrap/dist/fonts/**',
    'dest'  : 'build/fonts'
  }
};
