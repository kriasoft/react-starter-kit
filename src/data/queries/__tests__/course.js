/* eslint-env jest */
/* eslint-disable padded-blocks, no-unused-expressions */

import 'babel-regenerator-runtime';
import { graphql } from 'graphql';
import schema from '../../schema';
import models from '../../models';
import { createMockCourse, createMockUser, subscribeUser } from './common';

async function setupTest() {
  await models.sync({ force: true });
}

beforeAll(async () => setupTest());

describe('graphql courses', () => {
  async function getUserRole(user, course) {
    const Q = `query getUserRole(
      $user: [String],
      $course: [String]
    ){
      courses(ids: $course){
        users(ids: $user) {
          role,
        }
      }
    }`;

    const res = await graphql(schema, Q, null, null, {
      user,
      course,
    });

    return res.data.courses[0].users[0].role;
  }

  test('getUserRole', async () => {
    const user1 = await createMockUser('user1');
    const user2 = await createMockUser('user2');
    const course1 = await createMockCourse('course1');
    await subscribeUser(user1.id, course1.id, 'teacher');
    await subscribeUser(user2.id, course1.id, 'student');
    expect(await getUserRole(user1.id, course1.id)).toBe('teacher');
    expect(await getUserRole(user2.id, course1.id)).toBe('student');
  });
});
