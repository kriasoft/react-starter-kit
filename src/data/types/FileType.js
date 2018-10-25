import {
  GraphQLObjectType as ObjectType,
  GraphQLString as StringType,
  GraphQLNonNull as NonNull,
} from 'graphql';
import UserType from './UserType';
import User from '../models/User';

const FileType = new ObjectType({
  name: 'FileType',
  fields: () => ({
    id: { type: new NonNull(StringType) },
    url: { type: new NonNull(StringType) },
    internalName: { type: new NonNull(StringType) },
    user: {
      type: UserType,
      resolve: file => User.findById(file.userId),
    },
    createdAt: {
      type: StringType,
      resolve: file => file.createdAt.toISOString(),
    },
  }),
});

export default FileType;
