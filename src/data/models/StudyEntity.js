import DataType from 'sequelize';
import Model from '../sequelize';

const StudyEntity = Model.define('StudyEntity', {
  id: {
    type: DataType.UUID,
    defaultValue: DataType.UUIDV1,
    primaryKey: true,
  },

  title: {
    type: DataType.STRING(255),
  },

  body: {
    type: DataType.STRING(255),
  },
});

export default StudyEntity;
