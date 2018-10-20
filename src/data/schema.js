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
import {
  createUser,
  removeUser,
  updateUser,
  users,
  setPassword,
} from './queries/user';
import { files, uploadFile } from './queries/file';
import {
  createGroup,
  removeGroup,
  updateGroup,
  addUserToGroup,
  deleteUserFromGroup,
  groups,
} from './queries/group';
import {
  createCourse,
  removeCourse,
  courses,
  updateCourse,
  addUserToCourse,
  deleteUserFromCourse,
} from './queries/course';
import { createUnit, removeUnit, units, updateUnit } from './queries/unit';
import {
  createAnswer,
  answers,
  removeAnswer,
  updateAnswer,
} from './queries/answer';
import { createMark, marks, removeMark, updateMark } from './queries/mark';

const schema = new Schema({
  query: new ObjectType({
    name: 'Query',
    fields: {
      me,
      users,
      files,
      courses,
      units,
      answers,
      marks,
      groups,
    },
  }),
  mutation: new ObjectType({
    name: 'Mutation',
    fields: {
      createCourse,
      createAnswer,
      createUnit,
      createGroup,
      createUser,
      createMark,
      updateCourse,
      updateUnit,
      updateUser,
      updateMark,
      updateAnswer,
      uploadFile,
      addUserToCourse,
      deleteUserFromCourse,
      removeGroup,
      updateGroup,
      addUserToGroup,
      setPassword,
      deleteUserFromGroup,
      removeUnit,
      removeUser,
      removeAnswer,
      removeCourse,
      removeMark,
    },
  }),
});

export default schema;
