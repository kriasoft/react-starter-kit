/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import Sequelize from 'sequelize';
import { databaseUrl } from '../config';

// TODO: Customize database connection settings
/* jscs:disable requireCamelCaseOrUpperCaseIdentifiers */

// db.defaults.ssl = true;
// db.defaults.poolSize = 2;
// db.defaults.application_name = 'RSK';
/* jscs:enable requireCamelCaseOrUpperCaseIdentifiers */

const db = new Sequelize(databaseUrl);

export default db;
