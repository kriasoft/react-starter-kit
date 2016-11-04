/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import {
  GraphQLID as ID,
  GraphQLNonNull as NonNull,
  GraphQLObjectType as ObjectType,
  GraphQLString as StringType,
} from 'graphql';

const UserProfileType = new ObjectType({
  name: 'UserProfile',
  fields: {
    userId: { type: new NonNull(ID) },
    picture: { type: StringType },
  },
});

export default UserProfileType;
