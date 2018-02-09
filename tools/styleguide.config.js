const path = require('path');
const pkg = require('../package.json');

const reScript = /\.m?jsx?$/;
const reStyle = /\.(css|less|scss|sss)$/;
const reImage = /\.(bmp|gif|jpe?g|png|svg)$/;
const staticAssetName = '[path][name].[ext]?[hash:8]';

module.exports = {
  webpackConfig: {
    resolve: {
      // Allow absolute paths in imports, e.g. import Button from 'components/Button'
      // Keep in sync with .flowconfig and .eslintrc
      modules: ['node_modules', 'src'],
    },

    module: {
      // Make missing exports an error instead of warning
      strictExportPresence: true,

      rules: [
        // Rules for JS / JSX
        {
          test: reScript,
          loader: 'babel-loader',
          options: {
            // https://babeljs.io/docs/usage/options/
            babelrc: false,
            presets: [
              // A Babel preset that can automatically determine the Babel plugins and polyfills
              // https://github.com/babel/babel-preset-env
              [
                '@babel/preset-env',

                {
                  targets: {
                    browsers: pkg.browserslist,
                    forceAllTransforms: false,
                  },
                  modules: false,
                  useBuiltIns: false,
                  debug: false,
                },
              ],
              // Experimental ECMAScript proposals
              // https://babeljs.io/docs/plugins/#presets-stage-x-experimental-presets-
              '@babel/preset-stage-2',
              // Flow
              // https://github.com/babel/babel/tree/master/packages/babel-preset-flow
              '@babel/preset-flow',
              // JSX
              // https://github.com/babel/babel/tree/master/packages/babel-preset-react
              ['@babel/preset-react', { development: false }],
            ],
            plugins: [
              '@babel/plugin-proposal-decorators',
              // Treat React JSX elements as value types and hoist them to the highest scope
              // https://github.com/babel/babel/tree/master/packages/babel-plugin-transform-react-constant-elements
              '@babel/transform-react-constant-elements',
              // Replaces the React.createElement function with one that is more optimized for production
              // https://github.com/babel/babel/tree/master/packages/babel-plugin-transform-react-inline-elements
              '@babel/transform-react-inline-elements',
              // Remove unnecessary React propTypes from the production build
              // https://github.com/oliviertassinari/babel-plugin-transform-react-remove-prop-types
              'transform-react-remove-prop-types',
            ],
          },
        },

        // Rules for Style Sheets
        {
          test: reStyle,
          rules: [
            // Convert CSS into JS module
            {
              issuer: { not: [reStyle] },
              use: 'isomorphic-style-loader',
            },

            // { loader: "style-loader" },

            // Process external/third-party styles
            {
              exclude: path.resolve(__dirname, '../src'),
              loader: 'css-loader',
              options: {
                discardComments: { removeAll: true },
              },
            },

            // Process internal/project styles (from src folder)
            {
              include: path.resolve(__dirname, '../src'),
              loader: 'css-loader',
              options: {
                // CSS Loader https://github.com/webpack/css-loader
                importLoaders: 1,
                // CSS Modules https://github.com/css-modules/css-modules
                modules: true,
                localIdentName: '[name]-[local]-[hash:base64:5]',
                // CSS Nano http://cssnano.co/options/
                minimize: true,
                discardComments: { removeAll: true },
              },
            },

            // Apply PostCSS plugins including autoprefixer
            {
              loader: 'postcss-loader',
              options: {
                config: {
                  path: './tools/postcss.config.js',
                },
              },
            },

            // Compile Less to CSS
            // https://github.com/webpack-contrib/less-loader
            // Install dependencies before uncommenting: yarn add --dev less-loader less
            // {
            //   test: /\.less$/,
            //   loader: 'less-loader',
            // },

            // Compile Sass to CSS
            // https://github.com/webpack-contrib/sass-loader
            // Install dependencies before uncommenting: yarn add --dev sass-loader node-sass
            // {
            //   test: /\.scss$/,
            //   loader: 'sass-loader',
            // },
          ],
        },

        // Rules for images
        {
          test: reImage,
          oneOf: [
            // Inline lightweight images into CSS
            {
              issuer: reStyle,
              oneOf: [
                // Inline lightweight SVGs as UTF-8 encoded DataUrl string
                {
                  test: /\.svg$/,
                  loader: 'svg-url-loader',
                  options: {
                    name: staticAssetName,
                    limit: 4096, // 4kb
                  },
                },

                // Inline lightweight images as Base64 encoded DataUrl string
                {
                  loader: 'url-loader',
                  options: {
                    name: staticAssetName,
                    limit: 4096, // 4kb
                  },
                },
              ],
            },

            // Or return public URL to image resource
            {
              loader: 'file-loader',
              options: {
                name: staticAssetName,
              },
            },
          ],
        },

        // Convert plain text into JS module
        {
          test: /\.txt$/,
          loader: 'raw-loader',
        },

        // Convert Markdown into HTML
        {
          test: /\.md$/,
          loader: path.resolve(__dirname, './lib/markdown-loader.js'),
        },

        // Return public URL for all assets unless explicitly excluded
        // DO NOT FORGET to update `exclude` list when you adding a new loader
        {
          exclude: [reScript, reStyle, reImage, /\.json$/, /\.txt$/, /\.md$/],
          loader: 'file-loader',
          options: {
            name: staticAssetName,
          },
        },
      ],
    },
  },
  getComponentPathLine(componentPath) {
    const name = path.basename(componentPath, '.js');
    const dir = path.dirname(componentPath).split('../src/')[1];
    return `import ${name} from '${dir}';`;
  },
  styleguideComponents: {
    Wrapper: path.join(__dirname, 'lib/styleguide/Wrapper'),
  },
  highlightTheme: 'dracula',
  // editorConfig: {
  //   theme: 'dracula', // future config
  // },
  styleguideDir: path.join(__dirname, '../styleguide'),
  sections: [
    {
      name: 'Atoms',
      components: '../src/components/atoms/**/*.js',
    },
    {
      name: 'Molecules',
      components: '../src/components/molecules/**/*.js',
    },
    {
      name: 'Organisms',
      components: '../src/components/organisms/**/*.js',
    },
  ],
};
