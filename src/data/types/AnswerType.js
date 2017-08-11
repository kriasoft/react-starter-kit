import {
  GraphQLObjectType as ObjectType,
  GraphQLString as StringType,
  GraphQLNonNull as NonNull,
  GraphQLList,
} from 'graphql';
import MarkType from './MarkType';

const AnswerType = new ObjectType({
  name: 'AnswerType',
  fields: {
    id: { type: new NonNull(StringType) },
    body: { type: new NonNull(StringType) },
    marks: {
      type: new GraphQLList(MarkType),
      resolve: answer => answer.getMark(),
    },
  },
});

export default AnswerType;
