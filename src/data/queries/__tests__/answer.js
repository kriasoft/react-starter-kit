/* eslint-disable prettier/prettier */
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
import { NoAccessError } from '../../../errors';

async function setupTest() {
  await models.sync({ force: true });
}

beforeAll(async () => setupTest());

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
  beforeAll(async () => {
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
  const getAnswers = ({ userId, isAdmin, role, answers }) => {
    const allAnswersQ = `query data ($ids: [String]) { answers(ids: $ids) { id } }`;
    return graphql(
      schema,
      allAnswersQ,
      mockRequest({ userId, isAdmin, role }),
      null,
      answers && { ids: answers.map(ans => ans.id) },
    );
  };
  const t = async ({ userId, isAdmin, answers, role, error }, expAnswers) => {
    const res = (await getAnswers({ userId, isAdmin, answers, role }));
    if (error) {
      expect((res.errors||[]).length).toBeGreaterThan(0);
      return;
    }
    const a = res.data.answers.map(ans => ans.id).sort();
    const b = expAnswers.map(ans => ans.id).sort();
    expect(a).toEqual(expect.arrayContaining(b));
    expect(b).toEqual(expect.arrayContaining(a));
  };
  test('get answers by admin w/o id', async () =>
    t({}, []));
  test('get answers by u1', async () =>
    t({ userId: u1.id }, [a1]));
  test('get answers by u2', async () =>
    t({ userId: u2.id }, [a2]));
  test('get a1 by id by u1', async () =>
    t({ userId: u1.id, answers: [a1], isAdmin: false }, [a1]));
  test('get a2 by id by u1[isAdmin]', async () =>
    t({ userId: u1.id, answers: [a2], isAdmin: true }, [a2]));
  test('get a2 by id by u1', async () =>
    t({ userId: u1.id, answers: [a2], isAdmin: false, error: new NoAccessError() }));
  test('get a2 by id by u1[teacher]', async () =>
    t({ userId: u1.id, answers: [a2], isAdmin: false, role: 'teacher' }, [a2]));
});
