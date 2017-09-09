import {
  GraphQLObjectType as ObjectType,
  GraphQLString as StringType,
  GraphQLNonNull as NonNull,
  GraphQLList,
  GraphQLID as ID,
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
    users: {
      type: new GraphQLList(
        new ObjectType({
          name: 'CourseUserType',
          fields: {
            id: { type: new NonNull(ID) },
            email: { type: StringType },
          },
        }),
      ),
      resolve: course => course.getUser(),
    },
  },
});

export default CourseType;
