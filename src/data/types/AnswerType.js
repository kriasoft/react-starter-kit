import {
  GraphQLObjectType as ObjectType,
  GraphQLString as StringType,
  GraphQLNonNull as NonNull,
  GraphQLList,
} from 'graphql';
import MarkType from './MarkType';
import UserType from './UserType';

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
  }),
});

export default AnswerType;
