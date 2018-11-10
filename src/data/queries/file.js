import {
  GraphQLString as StringType,
  GraphQLList as List,
  GraphQLNonNull as NonNull,
} from 'graphql';
import FileType from '../types/FileType';
import File from '../models/File';
import { NotLoggedInError } from '../../errors';

const files = {
  type: new List(FileType),
  args: {
    ids: {
      description: 'ids of the file',
      type: new List(StringType),
    },
  },
  resolve({ request }, args) {
    if (!request.user) throw new NotLoggedInError();
    // TODO: user should be able to download only own files, files when they are
    // uploaded as an answer, or files when they are uploaded as a course material
    if (args.ids) {
      return File.findAll({
        where: {
          id: args.ids,
        },
      });
    }
    return File.findAll();
  },
};

const uploadFile = {
  type: FileType,
  args: {
    internalName: { type: new NonNull(StringType) },
  },
  resolve({ request }, args) {
    if (!request.user) throw new NotLoggedInError();
    return File.uploadFile({
      internalName: args.internalName,
      buffer: request.file.buffer,
      userId: request.user.id,
    });
  },
};

export { files, uploadFile };
