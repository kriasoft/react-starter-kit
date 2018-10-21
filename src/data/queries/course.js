import {
  GraphQLString as StringType,
  GraphQLList as List,
  GraphQLNonNull as NonNull,
} from 'graphql';
import CourseType from '../types/CourseType';
import UserType from '../types/UserType';
import UserCourseRoleType from '../types/UserCourseRoleType';
import { Course, User } from '../models';

const createCourse = {
  type: CourseType,
  args: {
    title: {
      description: 'The title of the new course',
      type: new NonNull(StringType),
    },
  },
  resolve({ request }, args) {
    if (!request.user) throw new Error('User is not logged in');
    return Course.create({
      ...args,
    });
  },
};

const removeCourse = {
  type: CourseType,
  args: {
    id: {
      description: 'id of the course',
      type: new NonNull(StringType),
    },
  },
  resolve(parent, args) {
    return Course.findById(args.id)
      .then(course => course.destroy())
      .then(() => {});
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
    if (!request.user) throw new Error('User is not logged in');
    const role = await request.user.getRole(args.courseId);
    if (!request.user.isAdmin && (!role || role !== 'teacher'))
      throw new Error("User doesn't have rights to edit this course");
    return User.findById(args.id).then(user =>
      Course.findById(args.courseId).then(course =>
        course
          .addUser(user, {
            through: { role: args.role },
          })
          .then(() => user),
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
  resolve(obj, args) {
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
    // addUnits: {
    //   description: 'Units of the courses',
    //   type: new List(StringType),
    // },
    // removeUnits: {
    //   description: 'Units of the courses',
    //   type: new List(StringType),
    // },
  },
  resolve(parent, args) {
    return Course.findById(args.id).then(course =>
      course.update({ title: args.title }),
    );
    // let course;
    // Course.findById(args.id)
    //   .then(_course => {
    //     course = _course;
    //     if (args.title) {
    //       course.title = args.title;
    //     }
    //     return course.getUnits();
    //   })
    //   .then(units => {
    //     const removeUnits = args.removeUnits || [];
    //     const addUnits = args.addUnits || [];
    //     const idsEqual = (i, rse) => String(rse) === String(units[i].id);
    //     for (let i = 0; i < units.length; i += 1) {
    //       if (removeUnits.find(idsEqual.bind(this, i))) {
    //         units.splice(i, 1);
    //         i -= 1;
    //       }
    //     }
    //     units = units.concat(addUnits);
    //     course.setUnits(units);
    //     return course.save();
    //   });
  },
};

export {
  createCourse,
  courses,
  removeCourse,
  updateCourse,
  addUserToCourse,
  deleteUserFromCourse,
};
