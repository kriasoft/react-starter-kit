/* eslint-env jest */
/* eslint-disable padded-blocks, no-unused-expressions */

import 'babel-regenerator-runtime';
import { graphql } from 'graphql';
import schema from '../../schema';
import models from '../../models';
import Group from '../../models/Group';

async function setupTest() {
  await models.sync({ force: true });
}

beforeAll(async () => setupTest());

describe('graphql groups', () => {
  afterEach(async () => Group.destroy({ where: {} }));
  function t(title) {
    const Q = `mutation create($title:String!) {
    createGroup(title: $title) {
        title,id
    }
    }`;
    return graphql(schema, Q, null, null, { title });
  }
  test('create', async () => {
    const title = 'test title';
    const res = await t(title);
    expect(res.data.createGroup.id).toBeDefined();
    expect(res.data.createGroup.title).toBe(title);
  });

  test('query groups', async () => {
    const Q = 'query {groups {title}}';
    const titles = ['test title', 'new title', 'another title'];
    await Promise.all(titles.map(title => t(title)));
    const res = await graphql(schema, Q);
    res.data.groups.forEach((group, i) => {
      expect(group.title).toBe(titles[i]);
    });
  });
});
