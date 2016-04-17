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
  GraphQLList as List,
} from 'graphql';

const IntlMessageType = new ObjectType({
  name: 'IntlMessage',
  fields: {
    id: { type: new NonNull(StringType) },
    defaultMessage: { type: new NonNull(StringType) },
    message: { type: StringType },
    description: { type: StringType },
    files: { type: new List(StringType) },
  },
});

export default IntlMessageType;
