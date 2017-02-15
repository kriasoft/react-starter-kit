/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import webpack from 'webpack';
import { writeFile } from 'fs';
import { open } from 'openurl';
import webpackConfig from './webpack.config';

const isDebug = !process.argv.includes('--release');
const WEBPACK_ANALYSER_URL = 'http://webpack.github.io/analyse/';

if (isDebug) {
  console.log('INFO: You should run `yarn stats -- --release` if you want production stats');
}

/**
 * Creates application stats for client bundle.
 */
function clientStats() {
  return new Promise((resolve, reject) => {
    const clientConfig = {
      ...webpackConfig[0],
      profile: true,
    };

    webpack(clientConfig).run((err, stats) => {
      if (err) {
        reject(err);
        return;
      }

      const statsJson = JSON.stringify(stats.toJson(), null, 2);
      writeFile('stats.json', statsJson, 'utf-8', (saveErr) => {
        if (saveErr) {
          console.error(saveErr.message);
          reject(saveErr);
          return;
        }
        console.log(`Now you can load \`stats.json\` into page at ${WEBPACK_ANALYSER_URL}`);
        open(WEBPACK_ANALYSER_URL);
        resolve(stats);
      });
    });
  });
}

export default clientStats;
