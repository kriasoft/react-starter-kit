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
  resolve(obj, args) {
    const where = {};
    if (args.ids) {
      where.id = args.ids;
    }
    return Course.findAll({ where });
  },
};

async function checkAccess(request, courseId) {
  if (!request.user) throw new NotLoggedInError();
  const role = await request.user.getRole(courseId);
  if (!request.user.isAdmin && (!role || role !== 'teacher'))
    throw new NoAccessError();
}

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
    await checkAccess(request, args.courseId);
    return User.findById(args.id).then(u =>
      Course.findById(args.courseId).then(course =>
        course
          .addUser(u, {
            through: { role: args.role },
          })
          .then(() => u),
      ),
    );
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
    await checkAccess(request, args.courseId);
    return User.findById(args.id).then(user =>
      Course.findById(args.courseId).then(course =>
        course.removeUser(user).then(() => user),
      ),
    );
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
    await checkAccess(request, args.id);
    return Course.findById(args.id).then(course =>
      course.update({ title: args.title }),
    );
  },
};

export {
  createCourse,
  courses,
  updateCourse,
  addUserToCourse,
  deleteUserFromCourse,
};
