/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import bcrypt from 'bcrypt-nodejs';
import DataType from 'sequelize';
import Model from '../sequelize';

const User = Model.define('User', {

  id: {
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },

  username: {
    type: DataType.STRING(120),
    unique: true,
    allowNull: false,
  },

  email: {
    type: DataType.STRING(255),
    unique: true,
    validate: { isEmail: true },
    allowNull: false,
  },

  password: {
    type: DataType.STRING(255),
    allowNull: false,
  },

}, {

  timestamps: true,

  updatedAt: false,

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
    { fields: ['username', 'email'] },
  ],

});

export default User;
