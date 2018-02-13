## How to Configure Text Editors and IDEs for React.js

> Tips and tricks on how to configure your favorite text editor or IDE to work
> with React.js/ES6+/JSX.

### WebStorm

// TODO: @Rodey can you write config for webstorm?
Create a new project based on **React Starter Kit template**

![react-project-template-in-webstorm](https://dl.dropboxusercontent.com/u/16006521/react-starter-kit/webstorm-new-project.png)

Make sure that **JSX** support is enabled in your project. This is set by default, if you create a new project based on React.js template.

![jsx-support-in-webstorm](https://dl.dropboxusercontent.com/u/16006521/react-starter-kit/webstorm-jsx.png)

Configure JavaScript libraries for **auto-complete**

![javascript-libraries-in-webstorm](https://dl.dropboxusercontent.com/u/16006521/react-starter-kit/webstorm-libraries.png)

Enable **ESLint** support

![eslint-support-in-webstorm](https://dl.dropboxusercontent.com/u/16006521/react-starter-kit/webstorm-eslint.png)

Enable **CSSComb** by following the instructions [here](https://github.com/csscomb/jetbrains-csscomb).

**If you have trouble with autoreloading** try to disable "safe write" in `File > Settings > System Settings > Use "safe write" (save changes to a temporary file first)`

### VSCode

Install vscode packages

* [eslint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
* [prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
* [editorconfig](https://github.com/editorconfig/editorconfig-vscode)

```shell
ext install eslint
ext install prettier-vscode
ext install EditorConfig
```

Add the following entries to your User Settings `(cmd + ,)`

```json
// Allow decorators on classes
{
  "javascript.implicitProjectConfig.experimentalDecorators": true
}
```

```json
// PREVENT searching in build dist and public folders
{
  "search.exclude": {
    "**/build": true,
    "**/dist": true,
    "**/public": true
  }
}
```
