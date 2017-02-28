## How to Integrate Browsersync

First, you need to install `browser-sync` package:

```bash
yarn add browser-sync --dev
```

Then, import `browserSync` in `tools/start.js`

```js
import browserSync from 'browser-sync';
```

And change `handleBundleComplete` function like this:

```js
let handleBundleComplete = async () => {
  handleBundleComplete = stats => !stats.stats[1].compilation.errors.length && runServer();

  const server = await runServer();
  const bs = browserSync.create();

  bs.init({
    ...isDebug ? {} : { notify: false, ui: false },

    proxy: {
      target: server.host,
      middleware: [wpMiddleware, hotMiddleware],
      proxyOptions: {
        xfwd: true,
      },
    },
  }, resolve);
};
```
