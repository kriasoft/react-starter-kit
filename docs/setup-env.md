## Necessary apps

1.  [Visual Studio Code](https://code.visualstudio.com)
2.  [Nodejs](https://nodejs.org/en/)
3.  [Yarn](https://yarnpkg.com/en/)
4.  [SqliteDB Browser](http://sqlitebrowser.org)

## ISU proxy config

### Enable

Git proxy setup

```bash
git config --global http.proxy http://proxy.isu.ru:3128
```

Yarn proxy setup

```bash
yarn config set proxy http://proxy.isu.ru:3128
yarn config set https-proxy http://proxy.isu.ru:3128
```

### Disable

Git remove proxy

```bash
git config --global --unset http.proxy
```

Yarn remove proxy:

```bash
yarn config delete proxy
yarn config delete https-proxy
```
