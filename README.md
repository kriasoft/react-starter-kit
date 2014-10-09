# Facebook React Starter Kit

[![Build Status](http://img.shields.io/travis/kriasoft/react-starter-kit/master.svg?style=flat)](http://travis-ci.org/kriasoft/react-starter-kit)
[![Dependency Status](https://david-dm.org/kriasoft/react-starter-kit.svg?style=flat)](https://david-dm.org/kriasoft/react-starter-kit)
[![devDependency Status](https://david-dm.org/kriasoft/react-starter-kit/dev-status.svg?style=flat)](https://david-dm.org/kriasoft/react-starter-kit#info=devDependencies)
[![Tips](http://img.shields.io/gratipay/koistya.svg?style=flat)](https://gratipay.com/koistya)
[![Gitter](http://img.shields.io/badge/chat-online-brightgreen.svg?style=flat)](https://gitter.im/kriasoft/react-starter-kit)

> This project template is a skeleton for a typical web application or single-page
> application (SPA) based on [Facebook React](https://facebook.github.io/react/).
> You can use it to quickly bootstrap your web application projects. It contains
> only client-side components and development tools and is recommended to be paired
> with a server-side project similar to [ASP.NET Web Application Starter Kit](https://github.com/kriasoft/AspNet-Server-Template).

[![Facebook React Starter Kit](https://dl.dropboxusercontent.com/u/16006521/Screens/facebook-react-starter-kit.png)](https://github.com/kriasoft/react-starter-kit)

**Source**: [https://github.com/kriasoft/react-starter-kit](https://github.com/kriasoft/react-starter-kit)

### Directory Layout

```
.
├── /build/                     # The folder for compiled output
├── /config/                    # Configuration files for Webpack, Karma etc.
├── /docs/                      # Documentation files
├── /node_modules/              # Node.js-based dev tools and utilities
├── /src/                       # The source code of the application
│   ├── /actions/               # Action creators that allow to trigger a dispatch to stores
│   ├── /assets/                # Static files which don't require pre-processing
│   ├── /constants/             # Enumerations used in action methods and stores
│   ├── /components/            # React components. E.g. Navbar.jsx
│   ├── /images/                # Graphics (.png, .jpg, .svg etc.)
│   ├── /layouts/               # Layouts for web pages
│   ├── /pages/                 # Web pages. E.g. Profile.jsx (or .html, .jade etc.)
│   ├── /stores/                # Stores contain the application state and logic
│   ├── /styles/                # LESS style sheets (or SASS/SCSS, Stylus etc.)
│   ├── /app.js                 # Entry point of your web application
│   └── /AppDispatcher.js       # The central hub that manages all data flow
├── /test/                      # Unit, integration and load tests
│   ├── /e2e/                   # End-to-end tests
│   └── /unit/                  # Unit tests
│── gulpfile.js                 # Configuration file for automated builds
└── package.json                # The list of 3rd party libraries and tools
```

### Getting Started

Just [clone](github-windows://openRepo/https://github.com/kriasoft/react-starter-kit) or [fork](https://github.com/kriasoft/react-starter-kit/fork) the repo and start hacking:

```shell
$ git clone -o upstream https://github.com/kriasoft/react-starter-kit.git MyApp
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
synchronized browsing support across multiple devices and browsers.

### How to Deploy

```shell
$ gulp deploy                   # or, `gulp deploy --production`
```

You can deploy to different destinations by adding a corresponding flag.
For example `--production` or `--staging` etc. See the 'deploy' task in
`gulpfile.js`.

### How to Update

You can always fetch and merge the recent changes from this repo back into
your own project:

```shell
$ git checkout master
$ git fetch upstream
$ git merge upstream/master
$ npm install
```

### How to Test

Run unit tests powered by [Jest](https://facebook.github.io/jest/) with the following
[npm](https://www.npmjs.org/doc/misc/npm-scripts.html) command:

```shell
$ npm test
```

### Learn More

 * [Getting Started with React.js](http://facebook.github.io/react/)
 * [React.js Wiki on GitHub](https://github.com/facebook/react/wiki)
 * [React.js Questions on StackOverflow](http://stackoverflow.com/questions/tagged/reactjs)
 * [React.js Discussion Board](https://groups.google.com/forum/#!forum/reactjs)
 * [Flux Architecture for Building User Interfaces](http://facebook.github.io/flux/)
 * [The Future of React](https://github.com/reactjs/react-future)
 * [Jest - Painless Unit Testing](http://facebook.github.io/jest/)

### Support

Have questions, feedback or need help? Contact [support@kriasoft.com](mailto:support@kriasoft.com)
or schedule a mentoring session on [codementor.io/koistya](https://www.codementor.io/koistya).

### Copyright

Source code is licensed under the MIT License. See [LICENSE.txt](./LICENSE.txt)
file in the project root. Documentation to the project is licensed under the
[CC BY 4.0](http://creativecommons.org/licenses/by/4.0/) license. React logo
image is a trademark of Facebook, Inc.
