import { GraphQLString as StringType, GraphQLList as List } from 'graphql';
import StudyEntityType from '../types/StudyEntityType';
import StudyEntity from '../models/StudyEntity';

const studyEntity = {
  type: StudyEntityType,
  args: {
    id: {
      description: 'id of the StudyEntity',
      type: StringType,
    },
  },
  resolve({ request }, args) {
    return StudyEntity.findById(args.id);
  },
};

const createStudyEntity = {
  type: StudyEntityType,
  args: {
    title: {
      description: 'The title of the new StudyEntity',
      type: StringType,
    },
    courseId:{
      description: 'Id of the course',
      type: StringType,
    } 
  },
  resolve({ request }, args) {
    return StudyEntity.create({
      title: args.title,
      courseId: args.courseId,
    });
  },
};


//При выполнении этого метода в Graphql вылетает ошибка
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
      where:{
        id: args.id,
      }
    });
  },
};

const studyEntities = {
  type: new List(StudyEntityType),
  resolve() {
    return StudyEntity.findAll();
  },
};

export { studyEntity, createStudyEntity, removeStudyEntity, studyEntities };
