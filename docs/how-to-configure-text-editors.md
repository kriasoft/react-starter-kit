## How to Configure Text Editors and IDEs for React.js [![img](https://img.shields.io/badge/discussion-join-green.svg?style=flat-square)](https://github.com/kriasoft/react-starter-kit/issues/117)

> Tips and tricks on how to configure your favorite text editor or IDE to work
> with React.js/ES6+/JSX.

### WebStorm

Create a new project based on **React Starter Kit template**

![react-project-template-in-webstorm](https://dl.dropboxusercontent.com/u/16006521/react-starter-kit/webstorm-new-project.png)

Make sure that **JSX** support is enabled in your project. This is set by default, if you create a new project based on React.js template.

![jsx-support-in-webstorm](https://dl.dropboxusercontent.com/u/16006521/react-starter-kit/webstorm-jsx.png)

Configure JavaScript libraries for **auto-complete**

![javascript-libraries-in-webstorm](https://dl.dropboxusercontent.com/u/16006521/react-starter-kit/webstorm-libraries.png)

Enable **ESLint** support

![eslint-support-in-webstorm](https://dl.dropboxusercontent.com/u/16006521/react-starter-kit/webstorm-eslint.png)

Enable **CSSComb** by installing CSSReorder plug-in

![csscomb-in-webstorm](https://dl.dropboxusercontent.com/u/16006521/react-starter-kit/webstorm-csscomb.png)

### Atom

Install atom packages

* [linter](https://atom.io/packages/linter)
* [linter-eslint](https://atom.io/packages/linter-eslint)
* [react](https://atom.io/packages/react)

```shell
apm install linter linter-eslint react
```

Install local npm packages

* [eslint](https://www.npmjs.com/package/eslint)
* [babel-eslint](https://www.npmjs.com/package/babel-eslint)
* [eslint-plugin-react](https://www.npmjs.com/package/eslint-plugin-react)

```shell
npm install --save-dev eslint babel-eslint eslint-plugin-react
```

*You may need to restart atom for changes to take effect*

### SublimeText

Coming soon.
