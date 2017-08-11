import { GraphQLString as StringType, GraphQLList as List } from 'graphql';
import Answer from '../models/Answer';
import AnswerType from '../types/AnswerType';

const addAnswer = {
  type: AnswerType,
  args: {
    body: {
      description: 'The body of the new answer',
      type: StringType,
    },
    courseId: {
      description: 'id of the courses',
      type: StringType,
    },
    userId: {
      description: 'id of the users',
      type: StringType,
    },
    studyEntityId: {
      description: 'id of the StudyEntities',
      type: StringType,
    },
  },
  resolve({ request }, args) {
    return Answer.create({
      body: args.body,
      CourseId: args.courseId,
      StudyEntityId: args.studyEntityId,
      UserId: args.userId,
    });
  },
};

//  При выполнении этого метода в Graphql вылетает ошибка
const removeAnswer = {
  type: AnswerType,
  args: {
    id: {
      description: 'id of the courses',
      type: StringType,
    },
  },
  resolve({ request }, args) {
    return Answer.destroy({
      where: {
        id: args.id,
      },
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
  resolve(obj, args) {
    if (args.ids) {
      return Answer.findAll({
        where: {
          id: args.ids,
        },
      });
    }
    return Answer.findAll();
  },
};

const updateAnswer = {
  type: AnswerType,
  args: {
    id: {
      description: 'id of the answer',
      type: StringType,
    },
    body: {
      description: 'The body of the answer',
      type: StringType,
    },
  },
  resolve({ request }, args) {
    Answer.findById(args.id).then(_answer => {
      const answer = _answer;
      if (args.body) {
        answer.body = args.body;
      }
      return answer.save();
    });
  },
};

export { addAnswer, answers, removeAnswer, updateAnswer };
