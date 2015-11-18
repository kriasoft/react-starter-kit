## React Starter Kit Change Log

All notable changes to this project will be documented in this file.

### [Unreleased][unreleased]

- Move `DOMUtils.js` to `src/core` folder; remove `src/utils` folder
- Replace [cssnext](http://cssnext.io/) with [precss](https://github.com/jonathantneal/precss)
- Update build automation scripts to use plain functions
- Add support of `--release` and `--verbose` flags to build scripts
- Add `CHANGELOG.md` file with a list of notable changes to this project

### [v0.4.1] - 2015-10-04

- Replace React Hot Loader (depricated) with React Transform
- Replace `index.html` template with `Html` (shell) React component
- Update the deployment script (`tools/deploy.js`), add Git-based deployment example
- Update ESLint and JSCS settings to use AirBnb JavaScript style guide
- Update `docs/how-to-configure-text-editors.md` to cover Atom editor
- Update NPM production and dev dependencies to use the latest versions

[unreleased]: https://github.com/kriasoft/react-starter-kit/compare/v0.4.1...HEAD
[v0.4.1]: https://github.com/kriasoft/react-starter-kit/compare/v0.4.0...v0.4.1
