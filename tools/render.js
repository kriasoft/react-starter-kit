/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import fetch from 'node-fetch';
import runServer from './runServer';
import fs from './lib/fs';
import { host } from '../src/config';

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
  let server;
  await new Promise(resolve => (server = runServer(resolve)));

  await routes.reduce((promise, route) => promise.then(async () => {
    const url = `http://${host}${route}`;
    const dir = `build/public${route.replace(/[^\/]*$/, '')}`;
    const name = route.endsWith('/') ? 'index.html' : `${route.match(/[^/]+$/)[0]}.html`;
    const dist = `${dir}${name}`;
    const res = await fetch(url);
    const text = await res.text();
    await fs.makeDir(dir);
    await fs.writeFile(dist, text);
    console.log(`${dist} => ${res.status} ${res.statusText}`);
  }), Promise.resolve());

  server.kill('SIGTERM');
}

export default render;
