/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import GitRepo from 'git-repository';
import fetch from 'node-fetch';
import run from './run';

// For more information visit http://gitolite.com/deploy.html
function getRemote(slot) {
  return {
    name: slot || 'production',
    url: `https://example${slot ? `-${slot}` : ''}.scm.azurewebsites.net:443/example.git`,
    branch: 'master',
    website: `http://example${slot ? `-${slot}` : ''}.azurewebsites.net`,
  };
}

/**
 * Deploy the contents of the `/build` folder to a remote
 * server via Git. Example: `yarn run deploy -- --production`
 */
async function deployToAzureWebApps() {
  // By default deploy to the staging deployment slot
  const remote = getRemote(process.argv.includes('--production') ? null : 'staging');

  // Initialize a new Git repository inside the `/build` folder
  // if it doesn't exist yet
  const repo = await GitRepo.open('build', { init: true });
  await repo.setRemote(remote.name, remote.url);

  // Fetch the remote repository if it exists
  const isRefExists = await repo.hasRef(remote.url, remote.branch);
  if (isRefExists) {
    await repo.fetch(remote.name);
    await repo.reset(`${remote.name}/${remote.branch}`, { hard: true });
    await repo.clean({ force: true });
  }

  // Build the project in RELEASE mode which
  // generates optimized and minimized bundles
  process.argv.push('--release');
  await run(require('./build'));

  // Push the contents of the build folder to the remote server via Git
  await repo.add('--all .');
  await repo.commit(`Update ${new Date().toISOString()}`);
  await repo.push(remote.name, `master:${remote.branch}`);

  // Check if the site was successfully deployed
  const response = await fetch(remote.website);
  console.log(`${remote.website} -> ${response.status}`);
}

export default deployToAzureWebApps;
