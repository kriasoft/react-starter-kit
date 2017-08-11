import DataType from 'sequelize';
import Model from '../sequelize';

const Answer = Model.define('Answer', {
  id: {
    type: DataType.UUID,
    defaultValue: DataType.UUIDV1,
    primaryKey: true,
  },

  body: {
    type: DataType.STRING,
  },
});

export default Answer;
