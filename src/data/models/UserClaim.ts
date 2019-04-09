/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import DataType, { Model } from 'sequelize';
import sequelize from '../sequelize';

class UserClaim extends Model {
  public type!: string;

  public value!: string;
}

UserClaim.init(
  {
    type: {
      type: DataType.STRING,
    },

    value: {
      type: DataType.STRING,
    },
  },
  {
    sequelize,
  },
);

export default UserClaim;
