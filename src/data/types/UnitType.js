import {
  GraphQLObjectType as ObjectType,
  GraphQLString as StringType,
  GraphQLNonNull as NonNull,
  GraphQLList,
} from 'graphql';

import AnswerType from './AnswerType';
import CourseType from './CourseType';

const UnitType = new ObjectType({
  name: 'UnitType',
  fields: () => ({
    id: { type: new NonNull(StringType) },
    title: { type: new NonNull(StringType) },
    body: { type: new NonNull(StringType) },
    answers: {
      type: new GraphQLList(AnswerType),
      resolve: unit => unit.getAnswers(),
    },
    courses: {
      type: new GraphQLList(CourseType),
      resolve: unit => unit.getCourses(),
    },
  }),
});

export default UnitType;
