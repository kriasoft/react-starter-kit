/* eslint-env jest */
/* eslint-disable padded-blocks, no-unused-expressions */

import 'babel-regenerator-runtime';
import { graphql } from 'graphql';
import schema from '../../schema';
import models from '../../models';

async function setupTest() {
  await models.sync({ force: true });
}

beforeAll(async () => setupTest());

describe('graphql users', () => {
  test('create', async () => {
    const Q = `mutation create($email:String, $key:String, $name:String, $gender:String) {
      createUser(email: $email, key: $key, name: $name, gender: $gender) {
        id, email, profile { gender }
      }
    }`;
    const email = 'test@test.com';
    const name = 'Test User';
    const gender = 'male';
    const res = await graphql(schema, Q, null, null, {
      email,
      key: '1234',
      name,
      gender,
    });
    expect(res.data.createUser.id).toBeDefined();
    expect(res.data.createUser.email).toBe(email);
    expect(res.data.createUser.profile.gender).toBe(gender);
  });
});
