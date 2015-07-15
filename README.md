# React Starter Kit

[![Build Status](http://img.shields.io/travis/kriasoft/react-starter-kit/master.svg?style=flat-square)](http://travis-ci.org/kriasoft/react-starter-kit)
[![Dependency Status](https://david-dm.org/kriasoft/react-starter-kit.svg?style=flat-square)](https://david-dm.org/kriasoft/react-starter-kit)
[![Tips](http://img.shields.io/gratipay/koistya.svg?style=flat-square)](https://gratipay.com/koistya)
[![Gitter](http://img.shields.io/badge/chat_room-%23react--starter--kit-blue.svg?style=flat-square)](https://gitter.im/kriasoft/react-starter-kit)

> This project template is a skeleton for an [isomorphic](http://nerds.airbnb.com/isomorphic-javascript-future-web-apps/)
> web application (SPA) based on Facebook's [React](https://facebook.github.io/react/)
> library and [Flux](http://facebook.github.io/flux/) architecture. You can use
> it to quickly bootstrap your web application projects. All the parts of this
> project template are easily replaceable.

**Demo**: http://demo.reactstarterkit.com

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
│── gulpfile.babel.js           # Configuration file for automated builds
│── package.json                # The list of 3rd party libraries and utilities
│── preprocessor.js             # ES6 transpiler settings for Jest
└── webpack.config.js           # Webpack configuration for bundling and optimization
```

### Getting Started

Just [clone](github-windows://openRepo/https://github.com/kriasoft/react-starter-kit) or
[fork](https://github.com/kriasoft/react-starter-kit/fork) the repo and start hacking:

```shell
$ git clone -o react-starter-kit -b master --single-branch \
      https://github.com/kriasoft/react-starter-kit.git MyApp
$ cd MyApp
$ npm install -g gulp           # Install Gulp task runner globally
$ npm install                   # Install Node.js components listed in ./package.json
```

### How to Build

```shell
$ gulp build                    # or, `gulp build --release`
```

By default, it builds in debug mode. If you need to build in release mode, add
`--release` flag.

### How to Run

```shell
$ gulp                          # or, `gulp --release`
```

This will start a lightweight development server with LiveReload and
synchronized browsing across multiple devices and browsers.

### How to Deploy

```shell
$ gulp build --release          # Builds the project in release mode
$ gulp deploy                   # or, `gulp deploy --production`
```

For more information see `deploy` task in `gulpfile.babel.js`.

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

 * [React Component Starter Kit](https://github.com/kriasoft/react-component-starter)
 * [React Decorators](https://github.com/kriasoft/react-decorators) (higher-order components)

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

### Copyright

Source code is licensed under the MIT License (MIT). See [LICENSE.txt](./LICENSE.txt)
file in the project root. Documentation to the project is licensed under the
[CC BY 4.0](http://creativecommons.org/licenses/by/4.0/) license. React logo
image is a trademark of Facebook, Inc.
