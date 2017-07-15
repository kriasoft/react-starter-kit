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
  GraphQLList,
} from 'graphql';
import CourseType from './CourseType';

const UserType = new ObjectType({
  name: 'UserType',
  fields: {
    id: { type: new NonNull(ID) },
    email: { type: StringType },
    courses: {
      type: new GraphQLList(CourseType),
      resolve: user => user.getCourses(),
    },
  },
});

export default UserType;
