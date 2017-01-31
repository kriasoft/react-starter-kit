/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import {
  GraphQLSchema as Schema,

  // GraphQLNonNull, GraphQLInt,
  GraphQLObjectType as ObjectType,

  // GraphQLList,
} from 'graphql';

import me from './queries/me';
import news from './queries/news';
import { gamesByNid } from './queries/games';

// import GameItemType from './types/GameItemType';

const schema = new Schema({
  query: new ObjectType({
    // id: 'nid',
    name: 'Query',
    fields: {
      me,
      news,
      gamesByNid,
    },
  }),
});

export default schema;
