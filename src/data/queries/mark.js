import {
  GraphQLString as StringType,
  GraphQLList as List,
  GraphQLFloat as FloatType,
} from 'graphql';
import MarkType from '../types/MarkType';
import Mark from '../models/Mark';

const addMark = {
  type: MarkType,
  args: {
    mark: {
      description: 'The mark of the new mark',
      type: FloatType,
    },
    comment: {
      description: 'The comment of the mark',
      type: StringType,
    },
    answerId: {
      description: 'The answerId of the mark',
      type: StringType,
    },
    authorId: {
      description: 'The userId for user adding a mark',
      type: StringType,
    },
  },
  resolve({ request }, args) {
    return Mark.create({
      ...args,
      authorId: request.user.id,
    });
  },
};

// when this method is called there is crash in GraphQL
const removeMark = {
  type: MarkType,
  args: {
    id: {
      description: 'id of the mark',
      type: StringType,
    },
  },
  resolve(parent, args) {
    return Mark.findById(args.id)
      .then(mark => mark.destroy())
      .then(() => {});
  },
};

const marks = {
  type: new List(MarkType),
  args: {
    ids: {
      description: 'ids of the marks',
      type: new List(StringType),
    },
  },
  resolve(obj, args) {
    const where = {};
    if (args.ids) {
      where.id = args.ids;
    }
    return Mark.findAll({ where });
  },
};

const updateMark = {
  type: MarkType,
  args: {
    id: {
      description: 'id of the mark',
      type: StringType,
    },
    mark: {
      description: 'The grade of the mark',
      type: FloatType,
    },
    comment: {
      description: 'The comment of the mark',
      type: StringType,
    },
  },
  resolve(parent, args) {
    return Mark.findById(args.id).then(mark => mark.update({ ...args }));
  },
};

export { addMark, marks, removeMark, updateMark };
