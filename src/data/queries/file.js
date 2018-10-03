import {
  GraphQLString as StringType,
  GraphQLList as List,
  GraphQLNonNull as NonNull,
} from 'graphql';
import FileType from '../types/FileType';
import File from '../models/File';

const files = {
  type: new List(FileType),
  args: {
    ids: {
      description: 'ids of the file',
      type: new List(StringType),
    },
  },
  resolve(obj, args) {
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
    return File.uploadFile({
      internalName: args.internalName,
      buffer: request.file.buffer,
      userId: request.user.id,
    });
  },
};

export { files, uploadFile };
