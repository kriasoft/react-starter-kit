/* eslint-env jest */
/* eslint-disable padded-blocks, no-unused-expressions */

import 'babel-regenerator-runtime';
import _ from 'lodash';
import { graphql } from 'graphql';
import schema from '../../schema';
import models from '../../models';

async function setupTest() {
  await models.sync({ force: true });
}

beforeEach(async () => setupTest());

describe('graphql courses', () => {
  async function createMockUser(name) {
    const createUserQ = `mutation create($email:String, $key:String, $name:String, $gender:String) {
      createUser(email: $email, key: $key, name: $name, gender: $gender) {
        id, email, profile { gender }
      }
    }`;
    const user = await graphql(
      schema,
      createUserQ,
      { request: { user: { isAdmin: true } } },
      null,
      {
        email: `${name}@example.com`,
        key: name,
        name,
        gender: 'male',
      },
    );
    return user.data.createUser;
  }

  async function createMockCourse(title) {
    const createCourseQ = `mutation createCourse($title:String!) {
      createCourse(title: $title) {
        id, title
      }
    }`;
    const course = await graphql(
      schema,
      createCourseQ,
      { request: { user: {} } },
      null,
      {
        title,
      },
    );
    return course.data.createCourse;
  }

  async function subscribeUser(user, course, role) {
    const addUserToCourseQ = `mutation addUserToCourse($course:String!,$user:String!,$role:String) {
      addUserToCourse(courseId: $course,id: $user,role: $role) {
        id
      }
    }`;
    const res = await graphql(
      schema,
      addUserToCourseQ,
      { request: { user: { isAdmin: true, getRole: _.noop } } },
      null,
      {
        course,
        user,
        role,
      },
    );
    return res.data.addUserToCourse;
  }

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
      user: [user],
      course: [course],
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
