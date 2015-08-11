/**
 * React Starter Kit (http://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2015 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import webpack from 'webpack';
import minimist from 'minimist';
import config from './config';

const argv = minimist(process.argv.slice(2));

/**
 * Bundles JavaScript, CSS and images into one or more packages
 * ready to be used in a browser.
 */
export default async () => new Promise((resolve, reject) => {
  console.log('bundle');
  const bundler = webpack(config);
  const verbose = !!argv.verbose;
  let bundlerRunCount = 0;

  function bundle(err, stats) {
    if (err) {
      return reject(err);
    }

    console.log(stats.toString({
      colors: true,
      hash: verbose,
      version: verbose,
      timings: verbose,
      chunks: verbose,
      chunkModules: verbose,
      cached: verbose,
      cachedAssets: verbose
    }));

    if (++bundlerRunCount === (global.watch ? config.length : 1)) {
      return resolve();
    }
  }

  if (global.watch) {
    bundler.watch(200, bundle);
  } else {
    bundler.run(bundle);
  }
});
