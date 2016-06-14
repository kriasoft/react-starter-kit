/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import path from 'path';
import fetch from 'node-fetch';
import { writeFile, makeDir } from './lib/fs';
import runServer from './runServer';

// Enter your paths here which you want to render as static
const routes = [
  '/',
  '/contact',
  '/login',
  '/register',
  '/about',
  '/privacy',
  '/404', // https://help.github.com/articles/creating-a-custom-404-page-for-your-github-pages-site/
];

async function render() {
  const server = await runServer();
  const result = await Promise.all(routes.map(async route => {
    const url = `http://${server.host}${route}`;
    const dir = path.resolve('build/public', path.dirname(route));
    const name = route.endsWith('/') ? 'index.html' : `${path.basename(route, '.html')}.html`;
    const dist = `${dir}${name}`;
    const res = await fetch(url);
    const text = await res.text();
    await makeDir(dir);
    await writeFile(dist, text);
    return `${dist} => ${res.status} ${res.statusText}`;
  }));
  server.kill('SIGTERM');
  console.log(result.join('\n'));
}

export default render;
