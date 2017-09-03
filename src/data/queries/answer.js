import { GraphQLString as StringType, GraphQLList as List } from 'graphql';
import Answer from '../models/Answer';
import User from '../models/User';
import StudyEntity from '../models/StudyEntity';
import Course from '../models/Course';
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
    userIds: {
      description: 'ids of the user',
      type: new List(StringType),
    },
    studyEntityIds: {
      description: 'ids of the study entities',
      type: new List(StringType),
    },
    courseIds: {
      description: 'ids of the courses',
      type: new List(StringType),
    },
  },
  resolve(obj, args) {
    const whereStatement = {};
    const includeStatement = [];
    if (args.ids) {
      whereStatement.id = args.ids;
    }
    if (args.userIds) {
      includeStatement.push({ model: User, where: { id: args.userIds } });
    }
    if (args.studyEntityIds) {
      includeStatement.push({
        model: StudyEntity,
        where: { id: args.studyEntityIds },
      });
    }
    if (args.courseIds) {
      includeStatement.push({ model: Course, where: { id: args.courseIds } });
    }
    return Answer.findAll({
      where: whereStatement,
      include: includeStatement,
    });
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
