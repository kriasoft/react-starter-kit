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
  GraphQLList as List,
} from 'graphql';

const PersonType = new ObjectType({
  name: 'Person',
  fields: () => ({
    name: { type: StringType },
    friends: {
      type: new List( PersonType ),
      resolve: async( person, args, { loaders }) => {
        return await loaders.personLoader.loadMany( person.friends );
      }
    }
  })
});

export default PersonType;
