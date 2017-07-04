import {
  GraphQLObjectType as ObjectType,
  GraphQLString as StringType,
  GraphQLNonNull as NonNull,
  GraphQLList,
} from 'graphql';
import StudyEntityType from './StudyEntityType';
import StudyEntity from '../models/StudyEntity';


const CourseType = new ObjectType({
  name: 'CourseType',
  fields: {
    id: { type: new NonNull(StringType) },
    title: { type: new NonNull(StringType) },
    studyEntities: {
      type: new GraphQLList(StudyEntityType),
      resolve: () => {
        return StudyEntity.findAll();
      },
    },
  },
});

export default CourseType;
