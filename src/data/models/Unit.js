import DataType from 'sequelize';
import Model from '../sequelize';
import * as util from './util';

const Unit = Model.define('unit', {
  id: {
    type: DataType.UUID,
    defaultValue: DataType.UUIDV1,
    primaryKey: true,
  },

  title: {
    type: DataType.STRING(255),
    allowNull: false,
  },

  body: {
    type: DataType.TEXT,
  },

  schema: {
    type: DataType.TEXT,
  },
});

Unit.prototype.canRead = async function canRead(user) {
  if (util.haveAccess(user)) return true;
  const courses = await this.getCourses();
  for (let i = 0; i < courses.length; i += 1) {
    // eslint-disable-next-line no-await-in-loop
    const role = await user.getRole(courses[i].id);
    if (!role) return false;
  }
  return true;
};

Unit.prototype.canWrite = function canWrite(user) {
  return util.haveRootAccess(user);
};

export default Unit;
