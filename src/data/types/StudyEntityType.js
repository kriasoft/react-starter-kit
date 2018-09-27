import {
  GraphQLObjectType as ObjectType,
  GraphQLString as StringType,
  GraphQLNonNull as NonNull,
  GraphQLList,
} from 'graphql';

import AnswerType from './AnswerType';
import CourseType from './CourseType';

const StudyEntityType = new ObjectType({
  name: 'StudyEntityType',
  fields: () => ({
    id: { type: new NonNull(StringType) },
    title: { type: new NonNull(StringType) },
    body: { type: new NonNull(StringType) },
    answers: {
      type: new GraphQLList(AnswerType),
      resolve: studyEntity => studyEntity.getAnswers(),
    },
    courses: {
      type: new GraphQLList(CourseType),
      resolve: studyEntity => studyEntity.getCourses(),
    },
  }),
});

export default StudyEntityType;
