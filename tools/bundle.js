/**
 * React Starter Kit (http://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2015 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import webpack from 'webpack';
import config from './config';

/**
 * Bundles JavaScript, CSS and images into one or more packages
 * ready to be used in a browser.
 */
export default async () => new Promise((resolve, reject) => {
  console.log('bundle');
  const bundler = webpack(config);
  let bundlerRunCount = 0;

  function bundle(err, stats) {
    if (err) {
      return reject(err);
    }

    console.log(stats.toString(config[0].stats));

    if (++bundlerRunCount === (global.WATCH ? config.length : 1)) {
      return resolve();
    }
  }

  if (global.WATCH) {
    bundler.watch(200, bundle);
  } else {
    bundler.run(bundle);
  }
});
