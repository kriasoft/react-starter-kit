/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import GitRepo from 'git-repository';
import run from './run';
import build from './build';

const remote = {
  name: 'github',
  url: 'https://github.com/{user}/{repo}.git',
  branch: 'gh-pages',
};

/**
 * Deploy the contents of the `/build/public` folder to GitHub Pages.
 */
async function deployToGitHubPages() {
  // Initialize a new Git repository inside the `/build` folder
  // if it doesn't exist yet
  const repo = await GitRepo.open('build/public', { init: true });
  await repo.setRemote(remote.name, remote.url);
  const isRefExists = await repo.hasRef(remote.url, remote.branch);
  if (isRefExists) {
    await repo.fetch(remote.name);
    await repo.reset(`${remote.name}/${remote.branch}`, { hard: true });
    await repo.clean({ force: true });
  }

  // Build the project in RELEASE mode which
  // generates optimized and minimized bundles
  process.argv.push('--static', '--release');
  await run(build);

  // Push the contents of the build folder to the remote server via Git
  await repo.add('--all .');
  await repo.commit(`Update ${new Date().toISOString()}`);
  await repo.push(remote.name, `master:${remote.branch}`);
}

export default deployToGitHubPages;
