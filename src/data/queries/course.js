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
  resolve(parent, args) {
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
    userId: {
      description: 'id of the logged in user',
      type: new List(StringType),
    },
  },
  resolve(obj, args) {
    if (args.ids) {
      return Course.findAll({
        where: {
          id: args.ids,
        },
      });
    }
    if (args.userId) {
      return Course.findAll({
        where: {
          '$users.Id$': args.userId,
        },
        include: [
          {
            model: User,
            as: 'users',
            required: true,
          },
        ],
      });
    }
    return Course.findAll();
  },
};

const subscribeUser = {
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
  resolve(obj, args) {
    return User.findById(args.id).then(user =>
      user
        .addCourse(args.courseId, {
          through: { role: args.role || 'student' },
        })
        .then(() => user),
    );
  },
};

const unsubscribeUser = {
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
    addStudyEntities: {
      description: 'StudyEntities of the courses',
      type: new List(StringType),
    },
    removeStudyEntities: {
      description: 'StudyEntities of the courses',
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
        return course.getStudyEntities();
      })
      .then(_studyEntities => {
        let studyEntities = _studyEntities;
        // studyEntities = studyEntities.filter(se => !args.removeStudyEntities.includes(se.id));
        const removeStudyEntities = args.removeStudyEntities || [];
        const addStudyEntities = args.addStudyEntities || [];
        const idsEqual = (i, rse) =>
          String(rse) === String(studyEntities[i].id);
        for (let i = 0; i < studyEntities.length; i += 1) {
          if (removeStudyEntities.find(idsEqual.bind(this, i))) {
            studyEntities.splice(i, 1);
            i -= 1;
          }
        }
        studyEntities = studyEntities.concat(addStudyEntities);
        course.setStudyEntities(studyEntities);
        return course.save();
      });
  },
};

export {
  createCourse,
  courses,
  removeCourse,
  updateCourses,
  subscribeUser,
  unsubscribeUser,
};
