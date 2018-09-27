import {
  GraphQLObjectType as ObjectType,
  GraphQLString as StringType,
  GraphQLNonNull as NonNull,
  GraphQLList,
} from 'graphql';
import MarkType from './MarkType';
import UserType from './UserType';
import StudyEntityType from './StudyEntityType';
import CourseType from './CourseType';

const AnswerType = new ObjectType({
  name: 'AnswerType',
  fields: () => ({
    id: { type: new NonNull(StringType) },
    body: { type: new NonNull(StringType) },
    marks: {
      type: new GraphQLList(MarkType),
      resolve: answer => answer.getMarks(),
    },
    user: {
      type: UserType,
      resolve: answer => answer.getUser(),
    },
    createdAt: {
      type: StringType,
      resolve: answer => answer.createdAt.toISOString(),
    },
    studyEntity: {
      type: StudyEntityType,
      resolve: answer => answer.getStudyEntity(),
    },
    course: {
      type: CourseType,
      resolve: answer => answer.getCourse(),
    },
  }),
});

export default AnswerType;
