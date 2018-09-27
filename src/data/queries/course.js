import { GraphQLString as StringType, GraphQLList as List } from 'graphql';
import CourseType from '../types/CourseType';
import UserType from '../types/UserType';
import { Course, User } from '../models';

const createCourse = {
  type: CourseType,
  args: {
    title: {
      description: 'The title of the new course',
      type: StringType,
    },
  },
  resolve({ request }, args) {
    if (!request.user) throw new Error('User is not logged in');
    return Course.create({
      title: args.title,
    });
  },
};

// when this method is called there is crash in GraphQL
const removeCourse = {
  type: CourseType,
  args: {
    id: {
      description: 'id of the courses',
      type: StringType,
    },
  },
  resolve(parent, args) {
    return Course.destroy({
      where: {
        id: args.id,
      },
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

const addUserToCourse = {
  type: UserType,
  args: {
    id: {
      description: 'id of the user',
      type: StringType,
    },
    courseId: {
      description: 'id of the course',
      type: StringType,
    },
    role: {
      description: 'role of the user',
      type: StringType,
    },
  },
  async resolve({ request }, args) {
    if (!request.user) throw new Error('User is not logged in');
    const role = await request.user.getRole(args.courseId);
    if (!request.user.isAdmin && (!role || role !== 'teacher'))
      throw new Error("User doesn't have rights to edit this course");
    return User.findById(args.id).then(user =>
      user
        .addCourse(args.courseId, {
          through: { role: args.role || 'student' },
        })
        .then(() => user),
    );
  },
};

const deleteUserFromCourse = {
  type: UserType,
  args: {
    id: {
      description: 'id of the user',
      type: StringType,
    },
    courseId: {
      description: 'id of the course',
      type: StringType,
    },
  },
  resolve(obj, args) {
    return User.findById(args.id).then(user =>
      user.removeCourse(args.courseId).then(() => user),
    );
  },
};

const updateCourses = {
  type: CourseType,
  args: {
    id: {
      description: 'id of the courses',
      type: StringType,
    },
    title: {
      description: 'The title of the course',
      type: StringType,
    },
    addUnits: {
      description: 'Units of the courses',
      type: new List(StringType),
    },
    removeUnits: {
      description: 'Units of the courses',
      type: new List(StringType),
    },
  },
  resolve(parent, args) {
    let course;
    Course.findById(args.id)
      .then(_course => {
        course = _course;
        if (args.title) {
          course.title = args.title;
        }
        return course.getUnits();
      })
      .then(units => {
        const removeUnits = args.removeUnits || [];
        const addUnits = args.addUnits || [];
        const idsEqual = (i, rse) => String(rse) === String(units[i].id);
        for (let i = 0; i < units.length; i += 1) {
          if (removeUnits.find(idsEqual.bind(this, i))) {
            units.splice(i, 1);
            i -= 1;
          }
        }
        units = units.concat(addUnits);
        course.setUnits(units);
        return course.save();
      });
  },
};

export {
  createCourse,
  courses,
  removeCourse,
  updateCourses,
  addUserToCourse,
  deleteUserFromCourse,
};
