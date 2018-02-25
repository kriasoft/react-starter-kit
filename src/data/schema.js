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
import { files, uploadFile } from './queries/file';
import {
  createGroup,
  removeGroup,
  addUserToGroup,
  deleteUserFromGroup,
  groups,
} from './queries/group';
import {
  createCourse,
  removeCourse,
  courses,
  updateCourses,
  addUserToCourse,
  deleteUserFromCourse,
} from './queries/course';
import {
  createStudyEntity,
  removeStudyEntity,
  studyEntities,
  updateStudyEntity,
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
      files,
      courses,
      studyEntities,
      answers,
      marks,
      groups,
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
      updateStudyEntity,
      createUser,
      removeUser,
      updateUser,
      addUserToCourse,
      deleteUserFromCourse,
      createGroup,
      removeGroup,
      addUserToGroup,
      deleteUserFromGroup,
      addAnswer,
      removeAnswer,
      updateAnswer,
      addMark,
      removeMark,
      updateMark,
      uploadFile,
    },
  }),
});

export default schema;
