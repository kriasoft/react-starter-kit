import 'babel-regenerator-runtime';
import {
  GraphQLString as StringType,
  GraphQLList as List,
  GraphQLNonNull as NonNull,
} from 'graphql';
import Answer from '../models/Answer';
import AnswerType from '../types/AnswerType';
import { NoAccessError } from '../../errors';

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

const answers = {
  type: new List(AnswerType),
  args: {
    ids: {
      description: 'ids of the answers',
      type: new List(StringType),
    },
  },
  async resolve({ request }, args) {
    if (!request.user) throw new NoAccessError();
    const where = {};
    if (args.ids) {
      where.id = args.ids;
    } else {
      where.userId = request.user.id;
    }
    const a = await Answer.findAll({ where });
    const ta = new Set(
      a
        .filter(answer => !request.haveAccess(answer.userId))
        .map(answer => answer.courseId),
    );
    // eslint-disable-next-line no-restricted-syntax
    for (const answer of ta) {
      // eslint-disable-next-line no-await-in-loop
      if ((await request.user.getRole(answer.courseId)) !== 'teacher')
        throw new NoAccessError();
    }
    return a;
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
  async resolve({ request }, args) {
    // answer can be saved only by its owner
    const answer = await Answer.findById(args.id);
    if (!request.haveAccess(answer.userId)) throw new NoAccessError();
    return answer.update({ body: args.body });
  },
};

export { createAnswer, answers, updateAnswer };
