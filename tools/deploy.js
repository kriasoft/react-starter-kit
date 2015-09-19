/**
 * React Starter Kit (http://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2015 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import push from 'git-push';

/**
 * Deploy the contents of the `/build` folder to a remote
 * server via Git. Example: `npm run deploy -- staging`
 */
export default () => new Promise((resolve, reject) => {
  let remote;

  if (process.argv.includes('production')) {
    remote = {
      name: 'production',
      url: 'https://example.scm.azurewebsites.net/example.git',
      branch: 'master',
    };
  } else if (process.argv.includes('staging')) {
    remote = {
      name: 'staging',
      url: 'https://example-staging.scm.azurewebsites.net/example.git',
      branch: 'master',
    };
  } else {
    remote = {
      name: 'test',
      url: 'https://example-test.scm.azurewebsites.net/example.git',
      branch: 'master',
    };
  }

  push('./build', remote, err => err ? reject(err) : resolve());
});
