// TODO: write documentation

import path from 'path';
import fetch from 'node-fetch';
import { writeFile, makeDir } from './lib/fs';
import runServer from './runServer';

// Enter your paths here which you want to render as static
// Example:
// const routes = [
//   '/',           // => build/public/index.html
//   '/page',       // => build/public/page.html
//   '/page/',      // => build/public/page/index.html
//   '/page/name',  // => build/public/page/name.html
//   '/page/name/', // => build/public/page/name/index.html
// ];
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

  // add dynamic routes
  // const products = await fetch(`http://${server.host}/api/products`).then(res => res.json());
  // products.forEach(product => routes.push(
  //   `/product/${product.uri}`,
  //   `/product/${product.uri}/specs`
  // ));

  await Promise.all(
    routes.map(async (route, index) => {
      const url = `http://${server.host}${route}`;
      const fileName = route.endsWith('/')
        ? 'index.html'
        : `${path.basename(route, '.html')}.html`;
      const dirName = path.join(
        'build/public',
        route.endsWith('/') ? route : path.dirname(route),
      );
      const dist = path.join(dirName, fileName);
      const timeStart = new Date();
      const response = await fetch(url);
      const timeEnd = new Date();
      const text = await response.text();
      await makeDir(dirName);
      await writeFile(dist, text);
      const time = timeEnd.getTime() - timeStart.getTime();
      console.info(
        `#${index + 1} ${dist} => ${response.status} ${
          response.statusText
        } (${time} ms)`,
      );
    }),
  );

  server.kill('SIGTERM');
}

export default render;
