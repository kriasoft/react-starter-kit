/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import cp from 'child_process';

export const spawn = (command, args, options) => new Promise((resolve, reject) => {
  cp.spawn(command, args, options).on('close', (code) => {
    if (code === 0) {
      resolve();
    } else {
      reject(new Error(`${command} ${args.join(' ')} => ${code} (error)`));
    }
  });
});

export default { spawn };
