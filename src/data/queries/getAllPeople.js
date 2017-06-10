/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import { GraphQLList as List } from 'graphql';
import PersonType from '../types/PersonType';
import allPeople from '../seed/people';

// export function getAllPeople() {
//   return people;
// };

const getAllPeople = {
  type: new List(PersonType),
  resolve: async( req, args, { loaders }) => {
    let people = allPeople.map((person => person._id));
    return await loaders.personLoader.loadMany( people );
  }
};

export default getAllPeople;
