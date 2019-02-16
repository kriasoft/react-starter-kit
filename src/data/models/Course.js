/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import DataType from 'sequelize';
import Model from '../sequelize';
import * as util from './util';

const Course = Model.define('course', {
  id: {
    type: DataType.UUID,
    defaultValue: DataType.UUIDV1,
    primaryKey: true,
  },

  title: {
    type: DataType.STRING(255),
    allowNull: false,
  },

  depsBody: {
    type: DataType.TEXT,
  },
});

Course.prototype.canRead = function canRead(user) {
  return !!user;
};

Course.prototype.canWrite = async function canWrite(user) {
  if (util.haveAccess(user)) return true;
  return user && (await user.getRole(this.id)) === 'teacher';
};

export default Course;
