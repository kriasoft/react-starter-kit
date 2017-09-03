/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import DataType from 'sequelize';
import bcrypt from 'bcrypt-nodejs';
import Model from '../sequelize';
import UserLogin from './UserLogin';
import UserProfile from './UserProfile';
import UserClaim from './UserClaim';

const User = Model.define(
  'User',
  {
    id: {
      type: DataType.UUID,
      defaultValue: DataType.UUIDV1,
      primaryKey: true,
    },

    email: {
      type: DataType.STRING(255),
      validate: { isEmail: true },
    },

    emailConfirmed: {
      type: DataType.BOOLEAN,
      defaultValue: false,
    },

    isAdmin: {
      type: DataType.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    indexes: [{ fields: ['email'] }],
  },
);

User.createUser = function createUser(args) {
  return Model.transaction(t =>
    User.create(
      {
        email: args.email,
        emailConfirmed: false,
        isAdmin: args.isAdmin,
        logins: [{ name: 'local', key: args.email }],
        claims: [
          {
            type: 'local',
            value: bcrypt.hashSync(args.key, bcrypt.genSaltSync()),
          },
        ],
        profile: {
          displayName: args.name,
          gender: args.gender,
          picture:
            'https://upload.wikimedia.org/wikipedia/commons/d/d3/User_Circle.png',
        },
      },
      {
        include: [
          { model: UserLogin, as: 'logins' },
          { model: UserClaim, as: 'claims' },
          { model: UserProfile, as: 'profile' },
        ],
        transaction: t,
      },
    ),
  );
};

export default User;
