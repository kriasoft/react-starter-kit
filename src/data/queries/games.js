/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import { GraphQLList as List, GraphQLInt,
GraphQLString } from 'graphql';
import { Node } from '../models';
import GameItemType from '../types/GameItemType';

// import { resolver } from 'graphql-sequelize';

// const items = [];
// let lastFetchTask;
// const lastFetchTime = new Date(1970, 0, 1);

export const nullVar = null;

export const gamesByNid = {
  type: new List(GameItemType),

  // resolve: resolver(Node),
  args: {
    nid: {
      description: 'game nid',
      type: new List(GraphQLInt),
      defaultValue: [3],
    },
    type: {
      description: 'game or game_base',
      type: GraphQLString,
      defaultValue: ['game', 'game_base'],
    },
  },

  resolve: async (_, query) => {
    // if (lastFetchTask) {
    //   return lastFetchTask;
    // }
    //
    // if ((new Date() - lastFetchTime) > 1000 * 60 * 10 /* 10 mins */) {
    //   lastFetchTime = new Date();
    //
    //   lastFetchTask = await Node.findAll({
    //     where: {
    //       nid: query.nid,
    //       type: query.type,
    //     },
    //   });
    //
    //   return lastFetchTask;
    // }
    //
    // return items;

    const result = await Node.findAll({
      where: {
        nid: query.nid,
        type: query.type,
      },
    });

    return result;
  },
};

// export default nullVar;
