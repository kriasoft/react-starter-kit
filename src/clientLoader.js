const readyStates = new Set(['complete', 'loaded', 'interactive']);

function loadMainClient() {
  const main = require('./client').default; // eslint-disable-line global-require
  main();
}

function run() {
  // Run the application when both DOM is ready and page content is loaded
  if (readyStates.has(document.readyState) && document.body) {
    loadMainClient();
  } else {
    document.addEventListener('DOMContentLoaded', loadMainClient, false);
  }
}

if (!global.Intl) {
  // You can show loading banner here

  require.ensure(
    [
      // Add all large polyfills here
      'intl',
      /* @intl-code-template 'intl/locale-data/jsonp/${lang}.js', */
      'intl/locale-data/jsonp/en.js',
      'intl/locale-data/jsonp/cs.js',
      /* @intl-code-template-end */
    ],
    require => {
      // and require them here
      require('intl');
      // TODO: This is bad. You should only require one language dynamically
      /* @intl-code-template require('intl/locale-data/jsonp/${lang}.js'); */
      require('intl/locale-data/jsonp/en.js');
      require('intl/locale-data/jsonp/cs.js');
      /* @intl-code-template-end */
      run();
    },
    'polyfills',
  );
} else {
  run();
}
