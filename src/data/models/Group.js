import DataType from 'sequelize';
import Model from '../sequelize';

const Group = Model.define('group', {
  id: {
    type: DataType.UUID,
    defaultValue: DataType.UUIDV1,
    primaryKey: true,
  },
  title: {
    type: DataType.STRING(255),
  },
});

export default Group;
