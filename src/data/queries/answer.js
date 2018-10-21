import {
  GraphQLString as StringType,
  GraphQLList as List,
  GraphQLNonNull as NonNull,
} from 'graphql';
import Answer from '../models/Answer';
import AnswerType from '../types/AnswerType';

const createAnswer = {
  type: AnswerType,
  args: {
    body: {
      description: 'The body of the new answer',
      type: new NonNull(StringType),
    },
    courseId: {
      description: 'id of the course',
      type: new NonNull(StringType),
    },
    unitId: {
      description: 'id of the unit',
      type: new NonNull(StringType),
    },
  },
  resolve({ request }, args) {
    return Answer.create({
      ...args,
      userId: request.user.id,
    });
  },
};

// when this method is called there is crash in GraphQL
const removeAnswer = {
  type: AnswerType,
  args: {
    id: {
      description: 'id of the courses',
      type: new NonNull(StringType),
    },
  },
  resolve(parent, args) {
    return Answer.findById(args.id)
      .then(answer => answer.destroy())
      .then(() => {});
  },
};

const answers = {
  type: new List(AnswerType),
  args: {
    ids: {
      description: 'ids of the answers',
      type: new List(StringType),
    },
  },
  resolve(obj, args) {
    const where = {};
    if (args.ids) {
      where.id = args.ids;
    }
    return Answer.findAll({ where });
  },
};

const updateAnswer = {
  type: AnswerType,
  args: {
    id: {
      description: 'id of the answer',
      type: new NonNull(StringType),
    },
    body: {
      description: 'The body of the answer',
      type: StringType,
    },
  },
  resolve(parent, args) {
    Answer.findById(args.id).then(answer => answer.update({ body: args.body }));
  },
};

export { createAnswer, answers, removeAnswer, updateAnswer };
