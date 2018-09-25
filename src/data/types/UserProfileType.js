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
  GraphQLID as ID,
  GraphQLString as StringType,
  GraphQLNonNull as NonNull,
} from 'graphql';

const UserProfileType = new ObjectType({
  name: 'UserProfileType',
  fields: () => ({
    userId: { type: new NonNull(ID) },
    displayName: { type: new NonNull(StringType) },
    picture: { type: new NonNull(StringType) },
    gender: { type: new NonNull(StringType) },
    location: { type: new NonNull(StringType) },
    website: { type: new NonNull(StringType) },
  }),
});

export default UserProfileType;
