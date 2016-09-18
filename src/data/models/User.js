/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import DataType from 'sequelize';
import bcrypt from 'bcrypt-nodejs';
import Model from '../sequelize';

const User = Model.define('User', {

  id: {
    type: DataType.UUID,
    defaultValue: DataType.UUIDV1,
    primaryKey: true,
  },

  username: {
    type: DataType.STRING(100),
    unique: true,
    allowNull: false,
  },

  email: {
    type: DataType.STRING(255),
    validate: { isEmail: true },
  },

  emailConfirmed: {
    type: DataType.BOOLEAN,
    defaultValue: false,
  },

  password: {
    type: DataType.STRING,
    allowNull: false,
  },

}, {
  classMethods: {
    generateHash: function (password) { // eslint-disable-line
      return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
    },
  },
  instanceMethods: {
    comparePassword: function (password) { // eslint-disable-line
      return bcrypt.compareSync(password, this.password);
    },
  },
  indexes: [
    { fields: ['email'] },
  ],
});

export default User;
