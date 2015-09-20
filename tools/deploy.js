/**
 * React Starter Kit (http://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2015 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import GitRepo from 'git-repository';
import fetch from './lib/fetch';

// TODO: Update deployment URL
// For more information visit http://gitolite.com/deploy.html
const getRemote = (slot) => ({
  name: slot ? slot : 'production',
  url: `https://example${slot ? '-' + slot : ''}.scm.azurewebsites.net:443/example.git`,
  website: `http://example${slot ? '-' + slot : ''}.azurewebsites.net`,
});

/**
 * Deploy the contents of the `/build` folder to a remote
 * server via Git. Example: `npm run deploy -- production`
 */
export default async () => {
  // By default deploy to the staging deployment slot
  const remote = getRemote(process.argv.includes('production') ? null : 'staging');

  // Initialize a new Git repository inside the `/build` folder
  // if it doesn't exist yet
  const repo = await GitRepo.open('build', { init: true });
  await repo.setRemote(remote.name, remote.url);

  // Fetch the remote repository if it exists
  if ((await repo.hasRef(remote.url, 'master'))) {
    await repo.fetch(remote.name);
    await repo.reset(`${remote.name}/master`, { hard: true });
    await repo.clean({ force: true });
  }

  // Build the project in RELEASE mode which
  // generates optimized and minimized bundles
  process.argv.push('release');
  await require('./build')();

  // Push the contents of the build folder to the remote server via Git
  await repo.add('--all .');
  await repo.commit('Update');
  await repo.push(remote.name, 'master');

  // Check if the site was successfully deployed
  const response = await fetch(remote.website);
  console.log(`${remote.website} -> ${response.statusCode}`);
};
