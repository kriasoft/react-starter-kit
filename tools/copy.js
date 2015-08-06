/**
 * React Starter Kit (http://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2015 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import { ncp as copy } from 'ncp';

/**
 * Copies static files such as robots.txt, favicon.ico to the
 * output (build) folder.
 */
export default () => {
  console.log('copy');
  return Promise.all([

    // Static files
    new Promise((resolve, reject) => {
      copy('src/public', 'build/public', err => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      })
    }),

    // Files with content (e.g. *.md files)
    new Promise((resolve, reject) => {
      copy('src/content', 'build/content', err => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      })
    }),

    // Website and email templates
    new Promise((resolve, reject) => {
      copy('src/templates', 'build/templates', err => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      })
    })
  ]);
};
