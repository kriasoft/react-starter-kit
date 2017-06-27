import {
  GraphQLObjectType as ObjectType,
  GraphQLString as StringType,
  GraphQLNonNull as NonNull,
} from 'graphql';

const CourseType = new ObjectType({
  name: 'CourseType',
  fields: {
    id: { type: new NonNull(StringType) },
    title: { type: new NonNull(StringType) },
  },
});

export default CourseType;
