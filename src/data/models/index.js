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
import StudyEntity from './StudyEntity';
import CourseStudyEntity from './CourseStudyEntity';

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

Course.belongsToMany(StudyEntity, {
  as: 'StudyEntities',
  through: {
    model: CourseStudyEntity,
  },
  foreignKey: 'courseId',
});

StudyEntity.belongsToMany(Course, {
  through: {
    model: CourseStudyEntity,
  },
  foreignKey: 'seId',
});

function sync(...args) {
  return sequelize.sync(...args);
}

export default { sync };
export { User, UserLogin, UserClaim, UserProfile, Course, StudyEntity };
