import { GraphQLString as StringType, GraphQLList as List } from 'graphql';
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

export default files;
