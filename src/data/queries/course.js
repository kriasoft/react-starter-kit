import { GraphQLString as StringType, GraphQLList as List } from 'graphql';
import CourseType from '../types/CourseType';
import Course from '../models/Course';

const course = {
  type: CourseType,
  args: {
    id: {
      description: 'id of the courses',
      type: StringType,
    },
  },
  resolve({ request }, args) {
    return Course.findById(args.id);
  },
};

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


//При выполнении этого метода в Graphql вылетает ошибка
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
      where:{
        id: args.id,
      }
    });
  },
};

const courses = {
  type: new List(CourseType),
  resolve() {
    return Course.findAll();
  },
};

export { course, createCourse, courses, removeCourse };
