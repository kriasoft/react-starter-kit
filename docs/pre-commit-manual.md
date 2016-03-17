## Pre-commit Manual

### It's not working? Run the following command to fix it.

- Clean your node_modules
```shell
$ npm uninstall precommit-hook-eslint
$ npm prune
```
- Reinstall
```shell
$ npm install precommit-hook-eslint --save-dev
```

### Still not working? Call the `install` bash manually!

- Install precommit-hook

```shell
$ node node_modules/precommit-hook-eslint/bin/install
```