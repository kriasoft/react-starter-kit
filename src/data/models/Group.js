import DataType from 'sequelize';
import Model from '../sequelize';
import * as util from './util';

const Group = Model.define('group', {
  id: {
    type: DataType.UUID,
    defaultValue: DataType.UUIDV1,
    primaryKey: true,
  },
  title: {
    type: DataType.STRING(255),
    allowNull: false,
  },
});

Group.prototype.canRead = function canRead(user) {
  return util.haveRootAccess(user);
};

Group.prototype.canWrite = function canWrite(user) {
  return util.haveRootAccess(user);
};

export default Group;
