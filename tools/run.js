/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

function format(time) {
  return time.toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, '$1');
}

async function run(fn, options) {
  const start = new Date();
  console.log(`[${format(start)}] Starting '${fn.name}'...`);
  await fn(options);
  const end = new Date();
  const time = end.getTime() - start.getTime();
  console.log(`[${format(end)}] Finished '${fn.name}' after ${time} ms`);
}

if (process.mainModule.children.length === 0 && process.argv.length > 2) {
  delete require.cache[__filename];
  const module = process.argv[2];
  run(require('./' + module + '.js')).catch(err => console.error(err.stack));
}

export default run;
