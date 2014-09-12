# Facebook React Starter Kit

> This project template is a skeleton for a typical web application or
> single-page application (SPA) based on Facebook React. You can use it
> to quickly bootstrap your web application projects. It contains only
> client-side components and development tools and is recommended to be
> paired with a server-side project similar to [ASP.NET Server Template]
> (https://github.com/kriasoft/AspNet-Server-Template).

**Source**: [https://github.com/kriasoft/react-seed](https://github.com/kriasoft/React-Seed)

#### Runtime Components

 * [React](https://facebook.github.io/react/) - A JavaScript library for building user interfaces, developed by Facebook
 * [Bootstrap](http://getbootstrap.com/) - CSS framework for developing responsive, mobile first interfaces
 * [jQuery](http://jquery.com/) - a JavaScript library designed to simplify the client-side scripting of HTML

#### Development Tools

 * [Gulp](http://gulpjs.com/) - JavaScript streaming build system and task automation
 * [Webpack](http://webpack.github.io/) - Compiles front-end source code into modules / bundles
 * [BrowserSync](http://www.browsersync.io/) - Lightweight HTTP server for development
 * [Karma](http://karma-runner.github.io/) - JavaScript unit-test runner (coming)
 * [Protractor](https://github.com/angular/protractor) - End-to-end test framework (coming)

### Directory Layout

```
.
├── /build/                     # The folder for compiled output
├── /docs/                      # Documentation files
├── /node_modules/              # Node.js-based dev tools and utilities
├── /src/                       # The source code of the application
│   ├── /assets/
│   ├── /data/
│   ├── /common/
│   ├── /components/
│   ├── /images/
│   ├── /layouts/
│   ├── /pages/
│   ├── /services/
│   ├── /styles/
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
> git clone -o base https://github.com/kriasoft/React-Seed MyApp
> cd MyApp
> npm install -g gulp           # Install Gulp task runner globally
> npm install                   # Install Node.js components listed in ./package.json
```

To compile the application and start a dev server run:

```shell
> gulp                          # or, `gulp --release`
```

To build the project, without starting a web server run:

```shell
> gulp build                    # or, `gulp build --release`
```

To deploy the application, run:

```shell
> gulp deploy                   # or, `gulp deploy --production`
```

### Contributors

Konstantin Tarkus — [@koistya](https://twitter.com/koistya)

### Support

Have questions, feedback or need help? Contact [support@kriasoft.com](mailto:support@kriasoft.com)
or schedule a mentoring session on [codementor.io/koistya](https://www.codementor.io/koistya).

### Copyright

Source code is licensed under the MIT License. See [LICENSE.txt](./LICENSE.txt)
file in the project root. Documentation to the project is licensed under the
[CC BY 4.0](http://creativecommons.org/licenses/by/4.0/) license. React logo
image is a trademark of Facebook, Inc.
