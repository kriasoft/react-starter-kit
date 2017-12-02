import DataType from 'sequelize';
import Model from '../sequelize';

const Mark = Model.define('Mark', {
  id: {
    type: DataType.UUID,
    defaultValue: DataType.UUIDV1,
    primaryKey: true,
  },

  mark: {
    type: DataType.FLOAT,
  },

  comment: {
    type: DataType.STRING,
  },

  createdAt: {
    type: DataType.STRING,
  },
});

export default Mark;
