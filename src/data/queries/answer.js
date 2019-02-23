import 'babel-regenerator-runtime';
import _ from 'lodash';
import {
  GraphQLString as StringType,
  GraphQLList as List,
  GraphQLNonNull as NonNull,
} from 'graphql';
import { Answer, File } from '../models';
import AnswerType from '../types/AnswerType';
import Model from '../sequelize';
import { NoAccessError } from '../../errors';

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
    // eslint-disable-next-line no-restricted-syntax
    for (const answer of a) {
      // eslint-disable-next-line no-await-in-loop
      if (!(await answer.canRead(request.user))) throw new NoAccessError();
    }
    return a;
  },
};

async function uploadFiles(request, answer, body, t) {
  const uploads = JSON.parse(request.body.upload_order);
  for (let i = 0; i < uploads.length; i += 1) {
    // eslint-disable-next-line no-await-in-loop
    const file = await File.uploadFile(
      {
        buffer: request.files[i].buffer,
        internalName: request.files[i].originalname,
        userId: request.user.id,
        parentType: 'answer',
        parentId: answer.id,
        key: uploads[i],
      },
      { transaction: t },
    );
    body[uploads[i]] = _.pick(file, [
      'createdAt',
      'id',
      'internalName',
      'updatedAt',
      'userId',
    ]);
  }
  return body;
}

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
  resolve: ({ request }, args) =>
    Model.transaction(async t => {
      const answer = await Answer.findById(args.id);
      if (!answer.canWrite(request.user)) throw new NoAccessError();
      const body = await uploadFiles(request, answer, JSON.parse(args.body), t);
      return answer.update({ body: JSON.stringify(body) }, { transaction: t });
    }),
};

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
  resolve: ({ request }, args) =>
    Model.transaction(async t => {
      const answer = await Answer.create(
        {
          ...args,
          userId: request.user.id,
        },
        { transaction: t },
      );
      const body = await uploadFiles(request, answer, JSON.parse(args.body), t);
      return answer.update({ body: JSON.stringify(body) }, { transaction: t });
    }),
};

export { createAnswer, answers, updateAnswer };
