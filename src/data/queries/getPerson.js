/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import allPeople from '../seed/people';

/* eslint-disable no-underscore-dangle */
export default function getPerson(_id) {
  let response = null;
  try {
    response = allPeople.find(people => people._id === _id);
  } catch (err) {
    /* eslint-disable no-console */
    console.log('getPerson err', err);
  }
  return response;
}
