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

export default Mark;
