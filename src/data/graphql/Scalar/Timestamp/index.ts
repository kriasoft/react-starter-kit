import { GraphQLScalarType } from 'graphql';
import { Kind } from 'graphql/language';

export const schema = [
  `
  # GraphQL cannot handle long - normal timestamp will go failed.
  # In that case, use Timestamp.
  scalar Timestamp

`,
];

export const resolvers = {
  Timestamp: new GraphQLScalarType({
    name: 'Timestamp',
    description: 'Timestamp custom scalar type',
    parseValue(value) {
      return value;
    },
    serialize(value) {
      return value;
    },
    parseLiteral(ast) {
      if (ast.kind === Kind.INT) {
        return ast.value;
      }
      return null;
    },
  }),
};
