import { graphql } from 'graphql';
import schema from '../../schema';

function mockRequest({ userId = '1' } = {}) {
  return {
    request: { user: { id: userId, isAdmin: true, getRole: () => {} } },
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
    { request: { user: {} } },
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
