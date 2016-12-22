## Using Yarn and Webpack as a Build Tool

The [Yarn](https://yarnpkg.com/) command line utility that comes with Node.js
allows you to run arbitrary scripts and [Node.js modules](https://www.npmjs.com/)
without them being globally installed. This is very convenient, because other
developers in your team don't need to worry about having some set of tools
installed globally before they can execute build automation scripts in your
project.

For example, if you need to lint your JavaScript code with [ESLint](http://eslint.org/)
and [JSCS](http://jscs.info/), you just install them as project's dependencies:

```shell
$ yarn add eslint jscs --dev
```

Add a new command line to `package.json/scripts`:

```json
{
  "devDependencies": {
    "eslint": "^1.10.0",
    "jscs": "^2.7.0"
  },
  "scripts": {
    "lint": "eslint src && jscs src"
  }
}
```

And execute it by running:

```shell
$ yarn run lint        # yarn run <script-name>
```

Which will be the same as running `./node_modules/bin/eslint src && ./node_modules/bin/jscs src`,
except that the former has a shorter syntax and works the the same way on all
platforms (Mac OS X, Windows, Linux).

The same way you can run [Webpack](http://webpack.github.io/) module bundler
to compile the source code of your app into a distributable format. Since
Webpack has numerous [configuration options](http://webpack.github.io/docs/configuration),
it's a good idea to have all of them in a separate configuration file, as
opposed to feeding them to Webpack's CLI as command line arguments. As a rule
of thumb, you want to keep the "scripts" section in your `package.json` file
short enough and easy to read.

For example, you may have `src/client.js` and `src/server.js` files that used
as entry points to the client-side and server-side code of your app. The
following Webpack configuration file (`webpack.config.js`) can be used
to bundle them into client-side and server-side application bundles -
`build/public/client.js` and `build/server.js` respectively:

```js
module.exports = [{
  context: __dirname + '/src'
  entry: './client.js',
  output: {
    path: __dirname + '/build/public',
    filename: 'client.js'
  }
}, {
  context: __dirname + '/src',
  entry: './server.js',
  output: {
    path: __dirname + '/build',
    filename: 'server.js',
    libraryTarget: 'commonjs2'
  },
  target: 'node',
  externals: /node_modules/,
}];
```

The `npm` script for it may look like this:

```json
{
  "devDependencies": {
    "webpack": "^1.12.0"
  },
  "scripts": {
    "build": "webpack --config webpack.config.js"
  }
}
```

You can run it as follows:

```shell
$ yarn run build
```
