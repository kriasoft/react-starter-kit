import {
  GraphQLObjectType as ObjectType,
  GraphQLString as StringType,
  GraphQLNonNull as NonNull,
} from 'graphql';
import AnswerType from './AnswerType';
import UserType from './UserType';
import UnitType from './UnitType';
import User from '../models/User';
import { Unit } from '../models';
import Answer from '../models/Answer';

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
    unit: {
      type: UnitType,
      resolve: file => Unit.findById(file.unitId),
    },
    answer: {
      type: AnswerType,
      resolve: file => Answer.findById(file.answerId),
    },
    createdAt: {
      type: StringType,
      resolve: file => file.createdAt.toISOString(),
    },
  }),
});

export default FileType;
