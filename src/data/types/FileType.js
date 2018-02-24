import {
  GraphQLObjectType as ObjectType,
  GraphQLString as StringType,
  GraphQLNonNull as NonNull,
} from 'graphql';
import UserType from './UserType';

const FileType = new ObjectType({
  name: 'FileType',
  fields: {
    id: { type: new NonNull(StringType) },
    url: { type: new NonNull(StringType) },
    internalName: { type: new NonNull(StringType) },
    user: {
      type: UserType,
      resolve: file => file.getUser(),
    },
    createdAt: {
      type: StringType,
      resolve: file => file.createdAt.toISOString(),
    },
  },
});

export default FileType;
