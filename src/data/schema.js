/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import {
  GraphQLSchema as Schema,
  GraphQLObjectType as ObjectType,
} from 'graphql';

import me from './queries/me';
import news from './queries/news';
import { createUser, removeUser, updateUser, users } from './queries/user';
import {
  createCourse,
  removeCourse,
  courses,
  updateCourses,
  subscribeUser,
} from './queries/course';
import {
  createStudyEntity,
  removeStudyEntity,
  studyEntities,
  updateStudyEntities,
} from './queries/studyEntity';
import {
  addAnswer,
  answers,
  removeAnswer,
  updateAnswer,
} from './queries/answer';
import { addMark, marks, removeMark, updateMark } from './queries/mark';

const schema = new Schema({
  query: new ObjectType({
    name: 'Query',
    fields: {
      me,
      news,
      users,
      courses,
      studyEntities,
      answers,
      marks,
    },
  }),
  mutation: new ObjectType({
    name: 'Mutation',
    fields: {
      createCourse,
      removeCourse,
      createStudyEntity,
      removeStudyEntity,
      updateCourses,
      updateStudyEntities,
      createUser,
      removeUser,
      updateUser,
      subscribeUser,
      addAnswer,
      removeAnswer,
      updateAnswer,
      addMark,
      removeMark,
      updateMark,
    },
  }),
});

export default schema;
