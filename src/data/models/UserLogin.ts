/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import DataType, {Model} from 'sequelize';
import sequelize from '../sequelize';

class UserLogin extends Model {}
UserLogin.init({
  name: {
    type: DataType.STRING(50),
    primaryKey: true,
  },

  key: {
    type: DataType.STRING(100),
    primaryKey: true,
  },
}, {sequelize});

export default UserLogin;
