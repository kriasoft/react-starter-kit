/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

module.exports = () => ({
  // The list of plugins for PostCSS
  // https://github.com/postcss/postcss
  plugins: [
    // Transfer @global-import rule by inlining content with :global CSS Modules scope
    // e.g. @global-import 'draft-js/dist/Draft.css'
    // https://github.com/scherebedov/postcss-global-import
    require('postcss-global-import')(),
    // Transfer @import rule by inlining content, e.g. @import 'normalize.css'
    // https://github.com/postcss/postcss-import
    require('postcss-import')(),
    // W3C variables, e.g. :root { --color: red; } div { background: var(--color); }
    // https://github.com/postcss/postcss-custom-properties
    require('postcss-custom-properties')(),
    // W3C CSS Custom Media Queries, e.g. @custom-media --small-viewport (max-width: 30em);
    // https://github.com/postcss/postcss-custom-media
    require('postcss-custom-media')(),
    // CSS4 Media Queries, e.g. @media screen and (width >= 500px) and (width <= 1200px) { }
    // https://github.com/postcss/postcss-media-minmax
    require('postcss-media-minmax')(),
    // W3C CSS Custom Selectors, e.g. @custom-selector :--heading h1, h2, h3, h4, h5, h6;
    // https://github.com/postcss/postcss-custom-selectors
    require('postcss-custom-selectors')(),
    // W3C calc() function, e.g. div { height: calc(100px - 2em); }
    // https://github.com/postcss/postcss-calc
    require('postcss-calc')(),
    // Allows you to nest one style rule inside another
    // https://github.com/jonathantneal/postcss-nesting
    require('postcss-nesting')(),
    // Unwraps nested rules like how Sass does it
    // https://github.com/postcss/postcss-nested
    require('postcss-nested')(),
    // W3C color() function, e.g. div { background: color(red alpha(90%)); }
    // https://github.com/postcss/postcss-color-function
    require('postcss-color-function')(),
    // Convert CSS shorthand filters to SVG equivalent, e.g. .blur { filter: blur(4px); }
    // https://github.com/iamvdo/pleeease-filters
    require('pleeease-filters')(),
    // Generate pixel fallback for "rem" units, e.g. div { margin: 2.5rem 2px 3em 100%; }
    // https://github.com/robwierzbowski/node-pixrem
    require('pixrem')(),
    // W3C CSS Level4 :matches() pseudo class, e.g. p:matches(:first-child, .special) { }
    // https://github.com/postcss/postcss-selector-matches
    require('postcss-selector-matches')(),
    // Transforms :not() W3C CSS Level 4 pseudo class to :not() CSS Level 3 selectors
    // https://github.com/postcss/postcss-selector-not
    require('postcss-selector-not')(),
    // Postcss flexbox bug fixer
    // https://github.com/luisrudge/postcss-flexbugs-fixes
    require('postcss-flexbugs-fixes')(),
    // Add vendor prefixes to CSS rules using values from caniuse.com
    // https://github.com/postcss/autoprefixer
    require('autoprefixer')(/* package.json/browserslist */),
  ],
});
