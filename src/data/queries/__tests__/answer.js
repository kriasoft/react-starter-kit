/* eslint-env jest */
/* eslint-disable padded-blocks, no-unused-expressions */

import 'babel-regenerator-runtime';
import { graphql } from 'graphql';
import schema from '../../schema';
import models from '../../models';
import {
  createMockUser,
  createMockCourse,
  createMockUnit,
  createMockAnswer,
  mockRequest,
} from './common';

async function setupTest() {
  await models.sync({ force: true });
}

beforeEach(async () => setupTest());

describe('graphql answers', () => {
  test('create', async () => {
    const course = await createMockCourse();
    const unit = await createMockUnit({ courseId: course.id });
    const user = await createMockUser();
    const answer = await createMockAnswer({
      courseId: course.id,
      userId: user.id,
      unitId: unit.id,
    });
    expect(answer.id).toBeDefined();
  });
});

describe('answers access rights', () => {
  // eslint-disable-next-line one-var
  let u1, u2, a1, a2;
  beforeEach(async () => {
    const course = await createMockCourse();
    const unit = await createMockUnit({ courseId: course.id });
    u1 = await createMockUser('user1');
    u2 = await createMockUser('user2');
    a1 = await createMockAnswer({
      courseId: course.id,
      userId: u1.id,
      unitId: unit.id,
    });
    a2 = await createMockAnswer({
      courseId: course.id,
      userId: u2.id,
      unitId: unit.id,
    });
  });
  const t = async ({ userId, isAdmin }) => {
    const allAnswersQ = `{ answers { id } }`;
    const res = await graphql(
      schema,
      allAnswersQ,
      mockRequest({ userId, isAdmin }),
      null,
    );
    return res.data.answers;
  };
  test('get all answers by admin', async () => {
    const a = (await t({ isAdmin: true })).map(ans => ans.id).sort();
    const b = [a1, a2].map(ans => ans.id).sort();
    expect(a).toEqual(expect.arrayContaining(b));
    expect(b).toEqual(expect.arrayContaining(a));
  });
  test('get all answers by user1', async () => {
    const a = (await t({ userId: u1.id, isAdmin: false }))
      .map(ans => ans.id)
      .sort();
    const b = [a1].map(ans => ans.id).sort();
    expect(a).toEqual(expect.arrayContaining(b));
    expect(b).toEqual(expect.arrayContaining(a));
  });
  test('get all answers by user1 [teacher]', async () => {
    const a = (await t({ userId: u1.id, isAdmin: false, role: 'teacher' }))
      .map(ans => ans.id)
      .sort();
    const b = [a1, a2].map(ans => ans.id).sort();
    expect(a).toEqual(expect.arrayContaining(b));
    expect(b).toEqual(expect.arrayContaining(a));
  });
});
