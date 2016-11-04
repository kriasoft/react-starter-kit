/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import {User, UserProfile} from '../models'

import UserType from '../types/UserType';

const me = {
  type: UserType,
  resolve({ request }) {
    return {
      id: request.user.id,
      email: request.user.email,
      Profile: UserProfile.findOne({
        where: {
          userId: request.user.id
        }
      })
    };
  },
};

export default me;
