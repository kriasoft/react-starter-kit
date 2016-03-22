// clean package.json and write to /build

import fs from './lib/fs';
import Promise from 'bluebird';

async function cleanPackage() {
  const jsonPackage = require('../package.json');
  await Promise.all([
    delete jsonPackage.devDependencies,
    delete jsonPackage.babel,
    delete jsonPackage.jest,
    delete jsonPackage.stylelint,
    jsonPackage.scripts = {
      start: 'node server.js',
    },
  ]);
  fs.writeFile('./build/package.json', JSON.stringify(jsonPackage, null, 2));
}

export default cleanPackage;
