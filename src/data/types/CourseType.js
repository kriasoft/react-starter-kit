import {
  GraphQLObjectType as ObjectType,
  GraphQLString as StringType,
  GraphQLNonNull as NonNull,
  GraphQLList,
} from 'graphql';
import StudyEntityType from './StudyEntityType';

const CourseType = new ObjectType({
  name: 'CourseType',
  fields: {
    id: { type: new NonNull(StringType) },
    title: { type: new NonNull(StringType) },
    studyEntities: {
      type: new GraphQLList(StudyEntityType),
      resolve: course => course.getStudyEntities(),
    },
  },
});

export default CourseType;
