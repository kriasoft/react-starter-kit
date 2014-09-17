var webpackConfig = require('./webpack.js')(/* release */ false);

module.exports = function (config) {
  config.set({

    basePath: '../',

    files: [
      'src/**/*Spec.jsx'
    ],

    preprocessors: {
      'src/**/*Spec.jsx': ['webpack']
    },

    webpack: {
      cache: true,
      module: {
        loaders: webpackConfig.module.loaders
      }
    },

    webpackServer: {
      stats: {
        colors: true
      }
    },

    autoWatch: false,

    singleRun: true,

    frameworks: ['jasmine'],

    browsers: ['Chrome'],

    plugins: [
      'karma-chrome-launcher',
      'karma-firefox-launcher',
      'karma-phantomjs-launcher',
      'karma-jasmine',
      'karma-webpack'
    ]

  });
};
