import { GraphQLString as StringType, GraphQLList as List } from 'graphql';
import CourseType from '../types/CourseType';
import Course from '../models/Course';

const createCourse = {
  type: CourseType,
  args: {
    title: {
      description: 'The title of the new course',
      type: StringType,
    },
  },
  resolve({ request }, args) {
    return Course.create({
      title: args.title,
    });
  },
};

//  При выполнении этого метода в Graphql вылетает ошибка
const removeCourse = {
  type: CourseType,
  args: {
    id: {
      description: 'id of the courses',
      type: StringType,
    },
  },
  resolve({ request }, args) {
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
    if (args.ids) {
      return Course.findAll({
        where: {
          id: args.ids,
        },
      });
    }
    return Course.findAll();
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
  resolve({ request }, args) {
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

export { createCourse, courses, removeCourse, updateCourses };
