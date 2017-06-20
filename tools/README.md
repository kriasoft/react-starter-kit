# Build Automation Tools

### `yarn start` (`start.js`)

* Cleans up the output `/build` directory (`clean.js`)
* Copies static files to the output folder (`copy.js`)
* Launches [Webpack](https://webpack.github.io/) compiler in a watch mode (via [webpack-middleware](https://github.com/kriasoft/webpack-middleware))
* Launches Node.js server from the compiled output folder (`runServer.js`)
* Launches [Browsersync](https://browsersync.io/),
  [Hot Module Replacement](https://webpack.github.io/docs/hot-module-replacement), and
  [React Hot Loader](https://github.com/gaearon/react-hot-loader)

### `yarn run build` (`build.js`)

* Cleans up the output `/build` folder (`clean.js`)
* Copies static files to the output folder (`copy.js`)
* Creates application bundles with Webpack (`bundle.js`, `webpack.config.js`)

### `yarn run deploy` (`deploy.js`)

* Builds the project from source files (`build.js`)
* Pushes the contents of the `/build` folder to a remote server with Git

## Options

Flag        | Description
----------- | --------------------------------------------------
`--release` | Minimizes and optimizes the compiled output
`--verbose` | Prints detailed information to the console
`--analyze` | Launches [Webpack Bundle Analyzer](https://github.com/th0r/webpack-bundle-analyzer)
`--static`  | Renders [specified routes](./render.js#L15) as static html files
`--docker`  | Build an image from a Dockerfile
`--silent`  | Do not open the default browser

For example:

```sh
$ yarn run build -- --release --verbose   # Build the app in production mode
```

or

```sh
$ yarn start -- --release                 # Launch dev server in production mode
```

## Misc

* `webpack.config.js` - Webpack configuration for both client-side and server-side bundles
* `postcss.config.js` - PostCSS configuration for transforming styles with JS plugins
* `run.js` - Helps to launch other scripts with `babel-node` (e.g. `babel-node tools/run build`)
* `.eslintrc` - ESLint overrides for built automation scripts
