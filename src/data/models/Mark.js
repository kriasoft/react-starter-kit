import DataType from 'sequelize';
import Model from '../sequelize';
import * as util from './util';

const Mark = Model.define('mark', {
  id: {
    type: DataType.UUID,
    defaultValue: DataType.UUIDV1,
    primaryKey: true,
  },

  mark: {
    type: DataType.FLOAT,
    validate: {
      max: 100,
      min: 0,
      isFloat: true,
    },
  },

  comment: {
    type: DataType.STRING,
  },
});

Mark.prototype.canRead = async function canRead(user) {
  if (util.haveAccess(user, this.authorId)) return true;
  const a = await this.getAnswer();
  return a.canRead(user);
};

Mark.prototype.canWrite = function canWrite(user) {
  return util.haveAccess(user, this.authorId);
};

export default Mark;
