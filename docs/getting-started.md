## Getting Started

### Requirements

* Mac OS X, Windows, or Linux
* [Yarn](https://yarnpkg.com/) package + [Node.js](https://nodejs.org/) v6.12.3 or newer
* Text editor or IDE pre-configured with React/JSX/Flow/ESlint ([learn more](./how-to-configure-text-editors.md))

### Directory Layout

Before you start, take a moment to see how the project structure looks like:

```
.
├── /build/                     # The folder for compiled output
├── /content/                   # Static local api content files which are copied into the /build/content folder
├── /docs/                      # Documentation files for the project
├── /node_modules/              # 3rd-party libraries and utilities
├── /public/                    # Static files which are copied into the /build/public folder
├── /src/                       # The source code of the application
│   ├── /actions/               # Redux Actions
│   ├── /components/            # React components (in atomic design)
│   ├── /constants/             # Constant variables
│   ├── /reducers/              # Redux Reducers
│   ├── /routes/                # Page/screen components along with the routing information
│   ├── /store/                 # Redux Store helpers
│   ├── /client.js              # Client-side startup script
│   ├── /config.js              # Global application settings
│   ├── /server.js              # Server-side startup script
│   └── ...                     # Other core framework modules
├── /test/                      # Unit and end-to-end tests
├── /tools/                     # Build automation scripts and utilities
│   ├── /lib/                   # Library for utility snippets
│       ├── /styleguide/        # Styleguideist tool dependencies
│       └── ...                 # Other tool library modules
│   ├── /build.js               # Builds the project from source to output (build) folder
│   ├── /bundle.js              # Bundles the web resources into package(s) through Webpack
│   ├── /clean.js               # Cleans up the output (build) folder
│   ├── /copy.js                # Copies static files to output (build) folder
│   ├── /deploy.js              # Deploys your web application
│   ├── /postcss.config.js      # Configuration for transforming styles with PostCSS plugins
│   ├── /render.js              # Render static site
│   ├── /run.js                 # Helper function for running build automation tasks
│   ├── /runServer.js           # Launches (or restarts) Node.js server
│   ├── /start.js               # Launches the development web server with "live reload"
│   ├── /styleguide.config.js   # Configurations for styleguideist
│   └── /webpack.config.js      # Configurations for client-side and server-side bundles
├── Dockerfile                  # Commands for building a Docker image for production
├── package.json                # The list of 3rd party libraries and utilities
├── web.config                  # The Azure web.config file for proper routing and MIME types
└── yarn.lock                   # Fixed versions of all the dependencies
```

### Quick Start

#### 1. Get the latest version

You can start by cloning the latest version of React Starter Kit (RSK) on your
local machine by running:

```shell
$ git clone https://REPO_DOMAIN/react-starter-kit MyAwesomeApp
$ cd MyAwesomeApp
```

#### 2. Run `yarn install`

This will install both run-time project dependencies and developer tools listed
in [package.json](../package.json) file.

#### 3. Run `yarn start`

This command will build the app from the source files (`/src`) into the output
`/build` folder. As soon as the initial build completes, it will start the
Node.js server (`node build/server.js`) and [Browsersync](https://browsersync.io/)
with [HMR](https://webpack.github.io/docs/hot-module-replacement) on top of it.

> [http://localhost:3000/](http://localhost:3000/) — Node.js server (`build/server.js`)
> with Browsersync and HMR enabled<br> > [http://localhost:3001/](http://localhost:3001/) — Browsersync control panel (UI)

Now you can open your web app in a browser, on mobile devices and start
hacking. Whenever you modify any of the source files inside the `/src` folder,
the module bundler ([Webpack](http://webpack.github.io/)) will recompile the
app on the fly and refresh all the connected browsers.

![browsersync](https://dl.dropboxusercontent.com/u/16006521/react-starter-kit/brwosersync.jpg)

Note that the `yarn start` command launches the app in `development` mode,
the compiled output files are not optimized and minimized in this case.
You can use `--release` command line argument to check how your app works
in release (production) mode:

```shell
$ yarn start --release
```

_NOTE: double dashes are required_

### How to Build, Test, Deploy

If you need just to build the app (without running a dev server), simply run:

```shell
$ yarn build
```

or, for a production build:

```shell
$ yarn build --release
```

or, for a production docker build:

```shell
$ yarn build --release --docker
```

_NOTE: double dashes are required_

After running this command, the `/build` folder will contain the compiled
version of the app. For example, you can launch Node.js server normally by
running `node build/server.js`.

To check the source code for syntax errors and potential issues run:

```shell
$ yarn lint
```

To launch unit tests:

```shell
$ yarn test          # Run unit tests with Jest
$ yarn test:watch    # Launch unit test runner and start watching for changes
```

By default, [Jest](https://facebook.github.io/jest/) test runner is looking for test files
matching the `src/**/*.test.js` pattern. Take a look at `src/components/base/Layout/Layout.test.js`
as an example.

To deploy the app, run:

```shell
$ yarn deploy
```

The deployment script `tools/deploy.js` is configured to push the contents of
the `/build` folder to a remote server via Git. You can easily deploy your app
to
[Azure Web Apps](https://azure.microsoft.com/en-us/services/app-service/web/),
or [Heroku](https://www.heroku.com/) this way. Both will execute `yarn install --production` upon receiving new files from you. Note, you should only deploy
the contents of the `/build` folder to a remote server.

### Styleguide

To work and launch the styleguide, run:

```shell
$ yarn styleguide
```

This will run a local server of the styleguide, for more information on how to
document components etc. see [React Styleguidist](https://react-styleguidist.js.org/).

### How to Update

If you need to keep your project up to date with the recent changes made to RSK,
you can always fetch and merge them from [this repo](https://github.com/kriasoft/react-starter-kit)
back into your own project by running:

```shell
$ git checkout master
$ git fetch react-starter-kit
$ git merge react-starter-kit/master
$ yarn install
```
