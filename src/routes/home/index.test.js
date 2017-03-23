/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

/* eslint-env mocha */
/* eslint-disable padded-blocks, no-unused-expressions */

import { expect } from 'chai';
import { resolve } from 'universal-router';
import nock from 'nock';
import route from './index';

describe('home route - /', () => {

  it('throws an error when no data is present in /graphql response', async () => {
    nock('http://localhost:3000')
      .post('/graphql')
      .reply(200, {});

    let err;

    try {
      await resolve(route, '/');
    } catch (e) {
      err = e;
    }

    expect(err).to.be.an('error');
    expect(err.message).to.be.equal('Failed to load the news feed.');
  });
});
