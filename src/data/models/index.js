/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import sequelize from '../sequelize';
import User from './User';
import UserLogin from './UserLogin';
import UserClaim from './UserClaim';
import UserProfile from './UserProfile';
import Course from './Course';
import Unit from './Unit';
import CourseUnit from './CourseUnit';
import UserCourse from './UserCourse';
import Answer from './Answer';
import Mark from './Mark';
import Group from './Group';
import UserGroup from './UserGroup';
import File from './File';

User.hasMany(UserLogin, {
  foreignKey: 'userId',
  as: 'logins',
  onUpdate: 'cascade',
  onDelete: 'cascade',
});

User.hasMany(UserClaim, {
  foreignKey: 'userId',
  as: 'claims',
  onUpdate: 'cascade',
  onDelete: 'cascade',
});

User.hasOne(UserProfile, {
  foreignKey: 'userId',
  as: 'profile',
  onUpdate: 'cascade',
  onDelete: 'cascade',
});

Course.belongsToMany(Unit, {
  as: 'units',
  through: {
    model: CourseUnit,
  },
  foreignKey: 'courseId',
});

Unit.belongsToMany(Course, {
  as: 'courses',
  through: {
    model: CourseUnit,
  },
  foreignKey: 'unitId',
});

User.belongsToMany(Course, {
  as: 'courses',
  through: {
    model: UserCourse,
  },
  foreignKey: 'userId',
});

User.hasMany(File, {
  as: 'files',
});

Course.belongsToMany(User, {
  as: 'users',
  through: {
    model: UserCourse,
  },
  foreignKey: 'courseId',
});

User.belongsToMany(Group, {
  as: 'groups',
  through: {
    model: UserGroup,
  },
  foreignKey: 'userId',
});

Group.belongsToMany(User, {
  as: 'users',
  through: {
    model: UserGroup,
  },
  foreignKey: 'groupId',
});

User.hasMany(Answer);
Unit.hasMany(Answer);
Unit.hasMany(File, {
  as: 'files',
});
File.belongsTo(Unit);
Course.hasMany(Answer);
CourseUnit.hasMany(Answer);

Answer.belongsTo(User);
Answer.belongsTo(Unit);
Answer.belongsTo(Course);
Answer.hasMany(File, {
  as: 'files',
});
File.belongsTo(Answer);

Answer.hasMany(Mark);
Mark.belongsTo(Answer);
Mark.belongsTo(User, { as: 'author' });

function sync(...args) {
  return sequelize.sync(...args);
}

export default { sync };
export {
  User,
  UserLogin,
  UserClaim,
  UserProfile,
  Course,
  Unit,
  UserCourse,
  Group,
  File,
  UserGroup,
};
