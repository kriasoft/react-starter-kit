/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import { GraphQLList as List } from 'graphql';
import AuthType from '../types/AuthType';

import { getLoadedStrategies } from '../../core/passport';
import { auth as authConfig } from '../../config';


let items;

const auth = {
  type: new List(AuthType),
  resolve() {
    if (items && items.length) {
      return items;
    }

    items = [];

    const loadedStrategies = getLoadedStrategies();
    loadedStrategies.forEach((authName) => {
      const loginButtons = authConfig.authConfig.loginButtons[authName];
      items.push({
        loginName: authName,
        icon: loginButtons.icon,
        buttonClass: loginButtons.buttonClass,
        buttonText: loginButtons.buttonText,
        routeTo: loginButtons.routeTo,
      });
    });

    return items;
  },
};

export default auth;
