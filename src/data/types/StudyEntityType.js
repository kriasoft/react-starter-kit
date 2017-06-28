import {
  GraphQLObjectType as ObjectType,
  GraphQLString as StringType,
  GraphQLNonNull as NonNull,
} from 'graphql';

const StudyEntityType = new ObjectType({
  name: 'StudyEntityType',
  fields: {
    id: { type: new NonNull(StringType) },
    title: { type: new NonNull(StringType) },
    courseId: { type: new NonNull(StringType) },
  },
});

export default StudyEntityType;
