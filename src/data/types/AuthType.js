/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import {
  GraphQLObjectType as ObjectType,
  GraphQLString as StringType,
  GraphQLNonNull as NonNull,
} from 'graphql';

const AuthType = new ObjectType({
  name: 'Auth',
  fields: {
    loginName: { type: new NonNull(StringType) },
    icon: { type: new NonNull(StringType) },
    buttonClass: { type: new NonNull(StringType) },
    buttonText: { type: new NonNull(StringType) },
    routeTo: { type: new NonNull(StringType) },
  },
});

export default AuthType;
