/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
import {
  GraphQLString as StringType,
  GraphQLList as List,
  GraphQLNonNull as NonNull,
} from 'graphql';
import CourseType from '../types/CourseType';
import UserType from '../types/UserType';
import UserCourseRoleType from '../types/UserCourseRoleType';
import { Course, User } from '../models';
import { NotLoggedInError, NoAccessError } from '../../errors';

const createCourse = {
  type: CourseType,
  args: {
    title: {
      description: 'The title of the new course',
      type: new NonNull(StringType),
    },
  },
  resolve({ request }, args) {
    if (!request.user) throw new NotLoggedInError();
    // TODO: for now only admin can create courses
    if (!request.user.isAdmin) throw new NoAccessError();
    return Course.create({
      ...args,
    });
  },
};

const courses = {
  type: new List(CourseType),
  args: {
    ids: {
      description: 'ids of the courses',
      type: new List(StringType),
    },
  },
  async resolve({ request }, args) {
    const where = {};
    if (args.ids) {
      where.id = args.ids;
    }
    const res = await Course.findAll({ where });
    for (const course of res) {
      if (!(await course.canRead(request.user))) throw new NoAccessError();
    }
    return res;
  },
};

const addUserToCourse = {
  type: UserType,
  args: {
    id: {
      description: 'id of the user',
      type: new NonNull(StringType),
    },
    courseId: {
      description: 'id of the course',
      type: new NonNull(StringType),
    },
    role: {
      description: 'role of the user',
      type: new NonNull(UserCourseRoleType),
    },
  },
  async resolve({ request }, args) {
    const course = await Course.findById(args.courseId);
    if (!(await course.canWrite(request.user))) throw new NoAccessError();
    const user = await User.findById(args.id);
    await course.addUser(user, { through: { role: args.role } });
    return user;
  },
};

const deleteUserFromCourse = {
  type: UserType,
  args: {
    id: {
      description: 'id of the user',
      type: new NonNull(StringType),
    },
    courseId: {
      description: 'id of the course',
      type: new NonNull(StringType),
    },
  },
  async resolve({ request }, args) {
    const course = await Course.findById(args.courseId);
    if (!(await course.canWrite(request.user))) throw new NoAccessError();
    const user = await User.findById(args.id);
    await course.removeUser(user);
    return user;
  },
};

const updateCourse = {
  type: CourseType,
  args: {
    id: {
      description: 'id of the course',
      type: new NonNull(StringType),
    },
    title: {
      description: 'The title of the course',
      type: StringType,
    },
  },
  async resolve({ request }, args) {
    const course = await Course.findById(args.id);
    if (!(await course.canWrite(request.user))) throw new NoAccessError();
    return course.update({ title: args.title });
  },
};

export {
  createCourse,
  courses,
  updateCourse,
  addUserToCourse,
  deleteUserFromCourse,
};
