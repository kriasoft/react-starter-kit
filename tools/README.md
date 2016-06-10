## Build Automation Tools

##### `npm start` (`start.js`)

* Cleans up the output `/build` directory (`clean.js`)
* Copies static files to the output folder (`copy.js`)
* Launches [Webpack](https://webpack.github.io/) compiler in a watch mode (via [webpack-middleware](https://github.com/kriasoft/webpack-middleware))
* Launches Node.js server from the compiled output folder (`runServer.js`)
* Launches [Browsersync](https://browsersync.io/),
  [HMR](https://webpack.github.io/docs/hot-module-replacement), and
  [React Transform](https://github.com/gaearon/babel-plugin-react-transform)

##### `npm run build` (`build.js`)

* Cleans up the output `/build` folder (`clean.js`)
* Copies static files to the output folder (`copy.js`)
* Creates application bundles with Webpack (`bundle.js`, `webpack.config.js`)

##### `npm run deploy` (`deploy.js`)

* Builds the project from source files (`build.js`)
* Pushes the contents of the `/build` folder to a remote server with Git

##### Options

Flag        | Description
----------- | -------------------------------------------------- 
`--release` | Minimizes and optimizes the compiled output
`--verbose` | Prints detailed information to the console
`--static`  | Renders [specified routes](./render.js#L15) as static html files

For example:

```sh
$ npm run build -- --release --verbose   # Build the app in production mode
```

or

```sh
$ npm start -- --release                 # Launch dev server in production mode
```

#### Misc

* `webpack.config.js` - Webpack configuration for both client-side and server-side bundles
* `run.js` - Helps to launch other scripts with `babel-node` (e.g. `babel-node tools/run build`)
* `.eslintrc` - ESLint overrides for built automation scripts
