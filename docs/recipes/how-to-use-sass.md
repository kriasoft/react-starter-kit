## How to Use Sass/SCSS

> **Note**: Using plain CSS via [PostCSS](http://postcss.org/) is recommended approach because it
reduces the size of the tech stack used in the project, enforces you to learn vanilla CSS syntax
with modern CSS Level 3+ features that allow you doing everything you would normally do with
Sass/SCSS. Also compilation of plain `.css` files should work faster with `postcss` pre-processor
than `node-sass`.

### Step 1

Install [`node-sass`](https://github.com/sass/node-sass) and
[`sass-loader`](https://github.com/jtangelder/sass-loader) modules as dev dependencies:

```sh
$ yarn add node-sass --dev
$ yarn add sass-loader --dev
```

### Step 2

Update [`webpack.config.js`](../../tools/webpack.config.js) file to use `sass-loader` for `.scss` files:

```js
const config = {
  ...
  module: {
    rules: [
      ...
      {
        test: /\.scss$/,
        use: [
          {
            loader: 'isomorphic-style-loader',
          },
          {
            loader: 'css-loader',
            options: {
              sourceMap: isDebug,
              minimize: !isDebug,
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              config: './tools/postcss.sass.js',
            },
          },
          {
            loader: 'sass-loader',
          },
        ],
      },
      ...
    ]
  }
  ...
}
```

### Step 3

Add one more configuration (`tools/postcss.sass.js`) for [PostCSS](https://github.com/postcss/postcss) to
enable [Autoprefixer](https://github.com/postcss/autoprefixer) for your `.scss` files:

```js
module.exports = () => ({
  plugins: [
    require('autoprefixer')(),
  ],
});
```

For more information visit https://github.com/jtangelder/sass-loader and https://github.com/sass/node-sass
