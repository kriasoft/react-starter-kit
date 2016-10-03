
// polyfills
import 'babel-polyfill';
import main from './client';

function run() {
  // Run the application when both DOM is ready and page content is loaded
  if (['complete', 'loaded', 'interactive'].includes(document.readyState) && document.body) {
    main();
  } else {
    document.addEventListener('DOMContentLoaded', main, false);
  }
}

const needHeavyPolyfills = false;

if (needHeavyPolyfills) {
  // You can show loading banner here

  require.ensure([
    // Add all large polyfills here
  ], (require) => { // eslint-disable-line no-unused-vars
    // and require them here
    // require('intl');
    // require('intl/locale-data/jsonp/en.js');

    run();
  }, 'polyfills');
} else {
  run();
}
