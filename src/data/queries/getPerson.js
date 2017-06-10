/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import PersonType from '../types/PersonType';
import allPeople from '../seed/people';

const people = allPeople;

export default function getPerson(_id) {
  let response = null;
  try {
    response = people.find(people => people._id === _id);
  } catch (err) {
    console.log('getPerson err', err);
  }
  console.log('RESPONSE: ', response);
  return response;
};
