import DataType from 'sequelize';
import Model from '../sequelize';

const File = Model.define('File', {
  id: {
    type: DataType.UUID,
    defaultValue: DataType.UUIDV1,
    primaryKey: true,
  },
  internalName: {
    type: DataType.STRING,
  },
  url: {
    type: DataType.STRING,
  },
});

export default File;
