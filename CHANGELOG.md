## React Starter Kit Change Log

All notable changes to this project will be documented in this file.

### [Unreleased][unreleased]

- Split the `App` component into `App` setting context variables and `Layout` setting general look and feel of the app (BREAKING CHANGE)
- Upgrade `history` npm module to v4.x, update `Link` component (BREAKING CHANGE)
- Remove `core/createHistory.js` in favor of initializing a new history instance inside `server.js` and `client.js` (BREAKING CHANGE)
- Remove Jade dependency in favor of React-based templates: `src/views/index.jade => src/components/Html`
  (BREAKING CHANGE) [#711](https://github.com/kriasoft/react-starter-kit/pull/711)
- Update `isomorphic-style-loader` to `v1.0.0`, it adds comparability with ES2015+ decorators.
  Code such as `export default withStyles(MyComponent, style1, style2)` must be replaced with
  `export default withStyles(style1, style2)(MyComponent)` (BREAKING CHANGE).
- Replace Jest with Mocha, Chai, Sinon. Unit test files must be renamed from
  `MyComponent/__test__/MyComponent-test.js` to `MyComponent/MyComponent.test.js` (BREAKING CHANGE).
- Remove `actions`, `stores` folders since there is no Flux library included into the kit
- Rename `server` variable in `server.js` to `app`
- Integrate [Sequelize](http://docs.sequelizejs.com/) to make the project compatible with different types of databases
- Rename `onSetTitle`, `onSetMeta` context variables to `setTitle`, `setMeta`
- Move `Content` component to `src/routes/content`
- Move `ErrorPage` component to `src/routes/error`
- Move the list of top-level routes to `src/routes/index`
- Update routing to use `universal-router` library
- Move Babel, ESLint and JSCS configurations to `package.json` [#497](https://github.com/kriasoft/react-starter-kit/pull/497)
- Convert `Feedback`, `Footer`, `Header`, and `Navigation` to functional stateless components
- Move page / screen components into the `src/routes` folder along with the routing information for them (BREAKING CHANGE). [6553936](https://github.com/kriasoft/react-starter-kit/commit/6553936e693e24a8ac6178f4962af15e0ea87dfd)

### [v0.5.1]
> 2016-03-02

- Remove `Html` React component in favor of compiled Jade templates (`src/views`) (BREAKING CHANGE). [e188388](https://github.com/kriasoft/react-starter-kit/commit/e188388f87069cdc7d501b385d6b0e46c98fed60)
- Add global error handling in Node.js/Express app. [e188388](https://github.com/kriasoft/react-starter-kit/commit/e188388f87069cdc7d501b385d6b0e46c98fed60)
- Add support for Markdown and HTML for static pages. [#469](https://github.com/kriasoft/react-starter-kit/pull/469), [#477](https://github.com/kriasoft/react-starter-kit/pull/477)

### [v0.5.0]
> 2016-02-27

- Replace RESTful API endpoint (`src/api`) with GraphQL (`src/data`)
- Add a sample GraphQL endpoint [localhost:3000/graphql](https://localhost:3000/graphql)
- Change the default Node.js server port from `5000` to `3000`
- Add a JWT-based authentication cookies (see `src/server.js`)
- Add a reference implementation of Facebook authentication strategy (`src/core/passport.js`)
- Add a sample database client utility for PostgreSQL (`src/core/db.js`)
- Optimize the `tools/start.js` script that launches dev server with Browsersync and HMR
- Replace Superagent with WHATWG Fetch library
- Rename `app.js` to `client.js` (aka client-side code)
- Integrate [CSS Modules](https://github.com/css-modules/css-modules) and
  [isomorphic-style-loader](https://github.com/kriasoft/isomorphic-style-loader)
- Move `DOMUtils.js` to `src/core` folder; remove `src/utils` folder
- Replace [cssnext](http://cssnext.io/) with [precss](https://github.com/jonathantneal/precss)
- Update build automation scripts to use plain functions
- Add support of `--release` and `--verbose` flags to build scripts
- Add `CHANGELOG.md` file with a list of notable changes to this project

### [v0.4.1]
> 2015-10-04

- Replace React Hot Loader (deprecated) with React Transform
- Replace `index.html` template with `Html` (shell) React component
- Update the deployment script (`tools/deploy.js`), add Git-based deployment example
- Update ESLint and JSCS settings to use AirBnb JavaScript style guide
- Update `docs/how-to-configure-text-editors.md` to cover Atom editor
- Update NPM production and dev dependencies to use the latest versions

[unreleased]: https://github.com/kriasoft/react-starter-kit/compare/v0.5.1...HEAD
[v0.5.1]: https://github.com/kriasoft/react-starter-kit/compare/v0.5.0...v0.5.1
[v0.5.0]: https://github.com/kriasoft/react-starter-kit/compare/v0.4.1...v0.5.0
[v0.4.1]: https://github.com/kriasoft/react-starter-kit/compare/v0.4.0...v0.4.1
