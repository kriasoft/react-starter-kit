/* eslint-env jest */
/* eslint-disable padded-blocks, no-unused-expressions */

import 'babel-regenerator-runtime';
import models from '../../models';
import {
  createMockUser,
  createMockCourse,
  createMockUnit,
  createMockAnswer,
} from './common';

async function setupTest() {
  await models.sync({ force: true });
}

beforeEach(async () => setupTest());

describe('answers', () => {
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
