/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-console */
import { parse as csv } from 'csv';
import models, { User } from '../src/data/models';

const promise = models.sync().catch(err => console.error(err.stack));

function getData() {
  const res = [];
  const header = [];
  return new Promise(resolve => {
    process.stdin
      .pipe(csv({ delimiter: ';' }))
      .on('data', data => {
        if (!header.length) {
          header.push(...data);
          return;
        }
        res.push(
          header.reduce((obj, v, i) => {
            obj[v] = data[i];
            return obj;
          }, {}),
        );
      })
      .on('end', () => resolve(res));
  });
}

async function main() {
  const data = await getData();
  for (const user of data) {
    user.isAdmin =
      (user.isAdmin && user.isAdmin.toLowerCase() === 'y') || false;
    await User.createUser(user);
    console.log(`Added user: ${user.email}`);
  }
}
promise.then(main);
