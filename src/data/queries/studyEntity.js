import { GraphQLString as StringType, GraphQLList as List } from 'graphql';
import StudyEntityType from '../types/StudyEntityType';
import StudyEntity from '../models/StudyEntity';
import Course from '../models/Course';

const createStudyEntity = {
  type: StudyEntityType,
  args: {
    title: {
      description: 'The title of the new StudyEntity',
      type: StringType,
    },
    courseId: {
      description: 'Id of the course',
      type: StringType,
    },
  },
  resolve({ request }, args) {
    let c;
    return Course.findById(args.courseId)
      .then(course => {
        c = course;
        return StudyEntity.create({ title: args.title });
      })
      .then(studyEntity => {
        studyEntity.setCourses([c]);
        return studyEntity.save();
      });
  },
};

//  При выполнении этого метода в Graphql вылетает ошибка
const removeStudyEntity = {
  type: StudyEntityType,
  args: {
    id: {
      description: 'id of the StudyEntity',
      type: StringType,
    },
  },
  resolve({ request }, args) {
    return StudyEntity.destroy({
      where: {
        id: args.id,
      },
    });
  },
};

const studyEntities = {
  type: new List(StudyEntityType),
  args: {
    ids: {
      description: 'ids of the StudyEntity',
      type: new List(StringType),
    },
  },
  resolve(obj, args) {
    if (args.ids) {
      return StudyEntity.findAll({
        where: {
          id: args.ids,
        },
      });
    }
    return StudyEntity.findAll();
  },
};

const updateStudyEntities = {
  type: StudyEntityType,
  args: {
    id: {
      description: 'id of the studyEntity',
      type: StringType,
    },
    title: {
      description: 'The title of the studyEntity',
      type: StringType,
    },
    body: {
      description: 'The body of the studyEntity',
      type: StringType,
    },
  },
  resolve({ request }, args) {
    StudyEntity.findById(args.id).then(_se => {
      const se = _se;
      if (args.title) {
        se.title = args.title;
      }
      if (args.body) {
        se.body = args.body;
      }
      return se.save();
    });
  },
};

export {
  createStudyEntity,
  removeStudyEntity,
  studyEntities,
  updateStudyEntities,
};
