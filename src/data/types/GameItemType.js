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

  // GraphQLNonNull as NonNull,
  // GraphQLInt,
} from 'graphql';

import {
  // resolver,
  attributeFields } from 'graphql-sequelize';

import { Node, GbUcProducts } from '../models';

const GameItemType = new ObjectType({
  name: 'GameItem',
  fields: Object.assign({}, attributeFields(Node), attributeFields(GbUcProducts)),

  // id: {
  //   description: 'id of the game',
  //   type: new NonNull(GraphQLInt),
  // },
});

export default GameItemType;
