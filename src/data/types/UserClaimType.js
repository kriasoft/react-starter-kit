/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import {
  GraphQLObjectType as ObjectType,
  GraphQLString as StringType,
  GraphQLNonNull as NonNull,
} from 'graphql';

const UserClaimType = new ObjectType({
  name: 'UserClaimType',
  fields: () => ({
    type: { type: new NonNull(StringType) },
    value: { type: new NonNull(StringType) },
  }),
});

export default UserClaimType;
