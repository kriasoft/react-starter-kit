import {
  GraphQLList as List,
  GraphQLObjectType as ObjectType,
  GraphQLString as StringType,
  GraphQLNonNull as NonNull,
} from 'graphql';

const ErrorType = new List(new ObjectType({
  name: 'Error',
  fields: {
    key: { type: new NonNull(StringType) },
    message: { type: StringType },
  },
}));

export default ErrorType;
