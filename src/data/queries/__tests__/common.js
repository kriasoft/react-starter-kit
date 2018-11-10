import { graphql } from 'graphql';
import _ from 'lodash';
import schema from '../../schema';

export function mockRequest({
  userId = '1',
  isAdmin = true,
  role = 'student',
} = {}) {
  const user = { id: userId, isAdmin, getRole: () => role };
  return {
    request: {
      user,
      // copied from server.js
      haveAccess: id => {
        if (!user) return false;
        if (user.isAdmin) return true;
        const ids = Array.isArray(id) ? id : [id];
        return ids.includes(user.id);
      },
    },
  };
}

export async function createMockCourse(title = 'mock course') {
  const createCourseQ = `mutation createCourse($title:String!) {
    createCourse(title: $title) {
      id, title
    }
  }`;
  const course = await graphql(
    schema,
    createCourseQ,
    { request: { user: { isAdmin: true } } },
    null,
    {
      title,
    },
  );
  return course.data.createCourse;
}

export async function createMockUnit({
  title = 'mock unit',
  courseId,
  body = '',
}) {
  const Q = `mutation createUnit($title:String!, $courseId:String!, $body:String!) {
    createUnit(title: $title, courseId: $courseId, body: $body) {
      id
    }
  }`;
  const unit = await graphql(schema, Q, mockRequest(), null, {
    title,
    courseId,
    body,
  });
  return unit.data.createUnit;
}

export async function createMockUser(name = 'user') {
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

export async function createMockAnswer({
  courseId,
  unitId,
  userId,
  body = '{}',
}) {
  const Q = `mutation createAnswer($body: String!, $courseId: String!, $unitId: String!) {
    createAnswer(body: $body, courseId: $courseId, unitId: $unitId) {
      id
    }
  }`;
  const res = await graphql(schema, Q, mockRequest({ userId }), null, {
    body,
    courseId,
    unitId,
  });
  return res.data.createAnswer;
}

export async function subscribeUser(user, course, role) {
  const addUserToCourseQ = `mutation addUserToCourse($course: String!, $user: String!, $role: UserCourseRole!) {
    addUserToCourse(courseId: $course, id: $user, role: $role) {
      id
    }
  }
  `;
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
