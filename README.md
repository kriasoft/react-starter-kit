# KriaSoft React Seed

> **Web Application Front-end Starter Kit** built with [Facebook React](https://github.com/facebook/react).

**Source**: [https://github.com/kriasoft/React-Seed](https://github.com/kriasoft/React-Seed)

#### Runtime Components:

 * [React](https://facebook.github.io/react/) - A JavaScript library for building user interfaces, developed by Facebook
 * [Bootstrap](http://getbootstrap.com/) - CSS framework for developing responsive, mobile first interfaces
 * [jQuery](http://jquery.com/) - a JavaScript library designed to simplify the client-side scripting of HTML

#### Development Tools:

 * [Webpack](http://webpack.github.io/) - Compiles front-end source code into modules / bundles
 * [Gulp](http://gulpjs.com/) - JavaScript streaming build system and task automation
 * [Karma](http://karma-runner.github.io/) - JavaScript unit-test runner (coming)
 * [Protractor](https://github.com/angular/protractor) - End-to-end test framework (coming)

### Directory Layout

```
.
├── /bower_components/          # 3rd party client-side libraries
├── /build/                     # The folder for compiled output
├── /docs/                      # Documentation files
├── /node_modules/              # Node.js-based dev tools and utilities
├── /src/                       # The source code of the application
│   ├── /assets/
│   ├── /data/
│   ├── /common/
│   ├── /images/
│   ├── /styles/
│   ├── /services/
│   ├── /404.html
│   ├── /app.jsx
│   └── /index.html
├── /test/                      # Unit, integration and load tests
│   ├── /e2e/                   # End-to-end tests
│   └── /unit/                  # Unit tests
└── ...
```

### Getting Started

To get started you can simply clone the repo and install the dependencies:

```shell
> git clone https://github.com/kriasoft/React-Seed MyApp && cd MyApp
> npm install -g gulp           # Install Gulp task runner globally
> npm install                   # Install Node.js components listed in ./package.json
```

To compile the application and start a dev server just run:

```shell
> gulp --watch                  # or, `gulp --watch --release`
```

To build the project, without starting a web server run:

```shell
> gulp build                    # or, `gulp build --release`
```

Now browse to the app at [http://localhost:3000/](http://localhost:3000/)

### Authors

 * [Konstantin Tarkus](https://angel.co/koistya) ([@koistya](https://twitter.com/koistya)), KriaSoft LLC

### Support

Need help or willing to contribute? Contact me via email: [hello@tarkus.me](mailto:hello@tarkus.me) or Skype: koistya

### Copyright

 * Source code is licensed under the MIT License. See [LICENSE.txt](./LICENSE.txt) file in the project root.
 * Documentation to the project is licensed under the [CC BY 4.0](http://creativecommons.org/licenses/by/4.0/) license.
