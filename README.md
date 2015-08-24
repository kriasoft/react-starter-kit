## React Starter Kit — "isomorphic" web app boilerplate

[![Support us on Bountysource](https://dl.dropboxusercontent.com/u/16006521/react-starter-kit/banner.png)](https://salt.bountysource.com/teams/react-starter-kit)<br>

> [React Starter Kit](http://www.reactstarterkit.com) is an opinionated
> boilerplate for web development built on top of Facebook's
> [React](https://facebook.github.io/react/) library,
> [Node.js](https://nodejs.org/) / [Express](http://expressjs.com/) server
> and [Flux](http://facebook.github.io/flux/) architecture. Containing
> modern web development tools such as [Webpack](http://webpack.github.io/),
> [Babel](http://babeljs.io/) and [BrowserSync](http://www.browsersync.io/).
> Helping you to stay productive following the best practices. A solid starting
> point for both professionals and newcomers to the industry.

Demo: http://demo.reactstarterkit.com &nbsp;|&nbsp;
Join [#react-starter-kit](https://gitter.im/kriasoft/react-starter-kit) chatroom on Gitter to stay up to date.

### Documentation

 * **General**
   - [React Style Guide](./docs/react-style-guide.md)
   - [How to configure text editors and IDEs](./docs/how-to-configure-text-editors.md)
 * **Questions**
   - [Which module bundler should I use?](https://github.com/kriasoft/react-starter-kit/issues/3)
   - [Which Flux implementation should I use?](https://github.com/kriasoft/react-starter-kit/issues/22)
 * **Recipes**
   - [How to Implement Routing and Navigation](./docs/recipes/how-to-implement-routing.md)
   - [How to Integrate Disqus](./docs/recipes/how-to-integrate-disqus.md)

### Directory Layout

```
.
├── /build/                     # The folder for compiled output
├── /docs/                      # Documentation files for the project
├── /node_modules/              # 3rd-party libraries and utilities
├── /src/                       # The source code of the application
│   ├── /api/                   # REST API / Relay endpoints
│   ├── /actions/               # Action creators that allow to trigger a dispatch to stores
│   ├── /components/            # React components
│   ├── /constants/             # Constants (action types etc.)
│   ├── /content/               # Static content (plain HTML or Markdown, Jade, you name it)
│   ├── /core/                  # Core components (Flux dispatcher, base classes, utilities)
│   ├── /decorators/            # Higher-order React components
│   ├── /public/                # Static files which are copied into the /build/public folder
│   ├── /stores/                # Stores contain the application state and logic
│   ├── /templates/             # HTML templates for server-side rendering, emails etc.
│   ├── /utils/                 # Utility classes and functions
│   ├── /app.js                 # Client-side startup script
│   └── /server.js              # Server-side startup script
├── /tools/                     # Build automation scripts and utilities
│   ├── /lib/                   # Library for utility snippets
│   ├── /build.js               # Builds the project from source to output (build) folder
│   ├── /bundle.js              # Bundles the web resources into package(s) through Webpack
│   ├── /clean.js               # Cleans up the output (build) folder
│   ├── /config.js              # Webpack configuration for both client and server side bundles
│   ├── /copy.js                # Copies static files to output (build) folder
│   ├── /serve.js               # Launches the Node.js/Express web server in a seperate process
│   ├── /start.js               # Launches the development web server with "live reload" functionality
│   └── /(deploy.js)            # Deploys your web application (Planned)
│── package.json                # The list of 3rd party libraries and utilities
└── preprocessor.js             # ES6 transpiler settings for Jest
```

### Getting Started

Just [clone](github-windows://openRepo/https://github.com/kriasoft/react-starter-kit) or
[fork](https://github.com/kriasoft/react-starter-kit/fork) the repo and start hacking:

```shell
$ git clone -o react-starter-kit -b master --single-branch \
      https://github.com/kriasoft/react-starter-kit.git MyApp
$ cd MyApp
$ npm install                   # Install Node.js components listed in ./package.json
$ npm start                     # Compile and launch
```

### How to Build

```shell
$ npm run build                 # or, `npm run build -- release`
```

By default, it builds in a *debug* mode. If you need to build in a release
mode, just add `-- release` flag. This will optimize the output bundle for
production deployment.

### How to Run

```shell
$ npm start                     # or, `npm start -- release`
```

This will start a lightweight development server with "live reload" and
synchronized browsing across multiple devices and browsers.

### How to Deploy

```shell
$ npm run deploy                # or, `npm run deploy -- production`
```

For more information see `tools/deploy.js`.

### How to Update

You can always fetch and merge the recent changes from this repo back into
your own project:

```shell
$ git checkout master
$ git fetch react-starter-kit
$ git merge react-starter-kit/master
$ npm install
```

### How to Test

Run unit tests powered by [Jest](https://facebook.github.io/jest/) with the following
[npm](https://www.npmjs.org/doc/misc/npm-scripts.html) command:

```shell
$ npm test
```

Test any javascript module by creating a `__tests__/` directory where
the file is. Name the test by appending `-test.js` to the js file.
[Jest](https://facebook.github.io/jest/) will do the rest.

### Customizations

 * [Azure deployment](https://github.com/kriasoft/react-starter-kit/pull/106)

### Related Projects

 * [React Static Boilerplate](https://github.com/koistya/react-static-boilerplate) — Generates a static website from React components
 * [Babel Starter Kit](https://github.com/kriasoft/babel-starter-kit) — A boilerplate for authoring JavaScript/React.js libraries
 * [React Decorators](https://github.com/kriasoft/react-decorators) — A collection of higher-order React components

### Learn More

 * [Getting Started with React.js](http://facebook.github.io/react/)
 * [React.js Wiki on GitHub](https://github.com/facebook/react/wiki)
 * [React.js Questions on StackOverflow](http://stackoverflow.com/questions/tagged/reactjs)
 * [React.js Discussion Board](https://discuss.reactjs.org/)
 * [Flux Architecture for Building User Interfaces](http://facebook.github.io/flux/)
 * [Jest - Painless Unit Testing](http://facebook.github.io/jest/)
 * [Flow - A static type checker for JavaScript](http://flowtype.org/)
 * [The Future of React](https://github.com/reactjs/react-future)
 * [Learn ES6](https://babeljs.io/docs/learn-es6/), [ES6 Features](https://github.com/lukehoban/es6features#readme)

### Support

 * [#react-starter-kit](https://gitter.im/kriasoft/react-starter-kit) on Gitter
 * [Live help sessions](http://start.thinkful.com/react/?utm_source=github&utm_medium=badge&utm_campaign=react-starter-kit) on Thinkful
 * [@koistya](https://www.codementor.io/koistya) on Codementor

### License

Copyright © 2014-2015 Kriasoft, LLC. This source code is licensed under the MIT
license found in the [LICENSE.txt](https://github.com/kriasoft/react-starter-kit/blob/master/LICENSE.txt)
file. The documentation to the project is licensed under the
[CC BY-SA 4.0](http://creativecommons.org/licenses/by-sa/4.0/) license.

---
Made with ♥ by Konstantin Tarkus ([@koistya](https://twitter.com/koistya)) and [contributors](https://github.com/kriasoft/react-starter-kit/graphs/contributors)
