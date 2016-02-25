/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import db from 'pg';
import Promise from 'bluebird';
import { databaseUrl } from '../config';

// TODO: Customize database connection settings
/* jscs:disable requireCamelCaseOrUpperCaseIdentifiers */
db.defaults.ssl = true;
db.defaults.poolSize = 2;
db.defaults.application_name = 'RSK';
/* jscs:enable requireCamelCaseOrUpperCaseIdentifiers */

/**
 * Promise-based wrapper for pg.Client
 * https://github.com/brianc/node-postgres/wiki/Client
 */
function AsyncClient(client) {
  this.client = client;
  this.query = this.query.bind(this);
  this.end = this.end.bind(this);
}

AsyncClient.prototype.query = function query(sql, ...args) {
  return new Promise((resolve, reject) => {
    if (args.length) {
      this.client.query(sql, args, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    } else {
      this.client.query(sql, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    }
  });
};

AsyncClient.prototype.end = function end() {
  this.client.end();
};

/**
 * Promise-based wrapper for pg.connect()
 * https://github.com/brianc/node-postgres/wiki/pg
 */
db.connect = (connect => callback => new Promise((resolve, reject) => {
  connect.call(db, databaseUrl, (err, client, done) => {
    if (err) {
      if (client) {
        done(client);
      }

      reject(err);
    } else {
      callback(new AsyncClient(client)).then(() => {
        done();
        resolve();
      }).catch(error => {
        done(client);
        reject(error);
      });
    }
  });
}))(db.connect);

export default db;
