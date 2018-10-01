import {
  GraphQLObjectType as ObjectType,
  GraphQLString as StringType,
  GraphQLNonNull as NonNull,
  GraphQLFloat as FloatType,
} from 'graphql';
import AnswerType from './AnswerType';
import UserType from './UserType';

const MarkType = new ObjectType({
  name: 'MarkType',
  fields: () => ({
    id: { type: new NonNull(StringType) },
    mark: { type: new NonNull(FloatType) },
    comment: { type: StringType },
    createdAt: {
      type: StringType,
      resolve: mark => mark.createdAt.toISOString(),
    },
    answer: {
      type: new NonNull(AnswerType),
      resolve: mark => mark.getAnswer(),
    },
    author: {
      type: new NonNull(UserType),
      resolve: mark => mark.getAuthor(),
    },
  }),
});

export default MarkType;
