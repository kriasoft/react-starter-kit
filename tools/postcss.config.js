/* eslint-disable global-require */

const pkg = require('../package.json');

module.exports = () => ({
  // The list of plugins for PostCSS
  // https://github.com/postcss/postcss
  plugins: [
    // Transfer @import rule by inlining content, e.g. @import 'normalize.css'
    // https://github.com/postcss/postcss-import
    require('postcss-import')(),
    // Postcss flexbox bug fixer
    // https://github.com/luisrudge/postcss-flexbugs-fixes
    require('postcss-flexbugs-fixes')(),
    // Postcss vmax fixer
    // https://github.com/jonathantneal/postcss-vmax
    require('postcss-vmax'),
    // Postcss object fit image fixer
    // https://github.com/ronik-design/postcss-object-fit-images
    require('postcss-object-fit-images'),
    // Postcss cssnext
    // http://cssnext.io/
    require('postcss-cssnext')({
      browsers: pkg.browserslist,
    }),
  ],
});
