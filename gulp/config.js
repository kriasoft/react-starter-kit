'use strict';

module.exports = {
  autoprefixer: {
    browsers: [   // https://github.com/ai/autoprefixer
      'ie >= 10',
      'ie_mob >= 10',
      'ff >= 30',
      'chrome >= 34',
      'safari >= 7',
      'opera >= 23',
      'ios >= 7',
      'android >= 4.4',
      'bb >= 10'
    ]
  },
  webpack: require('../webpack.config'),
  assets: [
    'src/assets/**',
    'src/content*/**/*.*',
    'src/templates*/**/*.*'
  ],
  styles: 'src/styles/**/*.{css,less}',
  server: [
    'build/server.js',
    'build/content/**/*',
    'build/templates/**/*'
  ],

  pagespeed: {
    url: 'example.com',
    stategy: 'mobile'
    //YOUR_API_KEY: ...
  }
};
