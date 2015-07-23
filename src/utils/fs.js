/*! React Starter Kit | MIT License | http://www.reactstarterkit.com/ */

import fs from 'fs';

const exists = filename => new Promise(resolve => {
  fs.exists(filename, resolve);
});

const readFile = filename => new Promise((resolve, reject) => {
  fs.readFile(filename, 'utf8', (err, data) => {
    if (err) {
      reject(err);
    } else {
      resolve(data);
    }
  });
});

export default { exists, readFile };
