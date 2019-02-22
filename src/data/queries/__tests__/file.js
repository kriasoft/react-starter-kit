/* eslint-env jest */
/* eslint-disable padded-blocks, no-unused-expressions */

import 'babel-regenerator-runtime';
import { graphql } from 'graphql';
import schema from '../../schema';
import models, { File } from '../../models';
import {
  createMockCourse,
  createMockUser,
  createMockAnswer,
  mockRequest,
  createMockUnit,
} from './common';
import { NoAccessError } from '../../../errors';

async function setupTest() {
  await models.sync({ force: true });
}

// eslint-disable-next-line one-var
let u1, u2, c1, unit1, a1, a2;
const files = [];

beforeAll(async () => {
  await setupTest();
  u1 = await createMockUser('u1');
  u2 = await createMockUser('u2');
  c1 = await createMockCourse('c1');
  unit1 = await createMockUnit({ courseId: c1.id });
  a1 = await createMockAnswer({
    courseId: c1.id,
    unitId: unit1.id,
    userId: u1.id,
    body: '',
  });
  a2 = await createMockAnswer({
    courseId: c1.id,
    unitId: unit1.id,
    userId: u1.id,
    body: '',
  });
  for (let i = 0; i < 3; i += 1) {
    files.push(
      // eslint-disable-next-line no-await-in-loop
      await File.uploadFile(
        {
          buffer: `test file ${i}`,
          internalName: `test${i}.txt`,
          userId: i < 2 ? u1.id : u2.id,
          parentType: 'answer',
          parentId: i < 2 ? a1.id : a2.id,
        },
        'mem',
      ),
    );
  }
});

async function t({ arExp, user, isAdmin, role, fls, error }) {
  const Q = `query files($ids: [String]){ files(ids: $ids) { id } }`;
  const res = await graphql(
    schema,
    Q,
    mockRequest({ userId: user.id, isAdmin, role }),
    null,
    fls && {
      ids: fls.map(f => f.id),
    },
  );
  if (error) {
    expect((res.errors || []).length).toBeGreaterThan(0);
    return;
  }
  const ra = res.data.files.map(f => f.id).sort();
  const ea = arExp.map(f => f.id).sort();
  expect(ra).toEqual(ea);
}

describe('files access', () => {
  test('read my files', () =>
    t({ arExp: [files[0], files[1]], user: u1, isAdmin: false }));
  test('read files[no role]', () =>
    t({
      error: new NoAccessError(),
      user: u1,
      isAdmin: false,
      role: '',
      fls: [files[2]],
    }));
  test('read files[as a student]', () =>
    t({
      arExp: [files[2]],
      user: u1,
      isAdmin: false,
      role: 'student',
      fls: [files[2]],
    }));
  test('read files[as a teacher]', () =>
    t({
      arExp: [files[2]],
      user: u1,
      isAdmin: false,
      role: 'teacher',
      fls: [files[2]],
    }));
});
