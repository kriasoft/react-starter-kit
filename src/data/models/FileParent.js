import DataType from 'sequelize';
import Model from '../sequelize';

const FileParent = Model.define('fileParent', {
  id: {
    type: DataType.UUID,
    defaultValue: DataType.UUIDV1,
    primaryKey: true,
  },
  parentType: {
    type: DataType.STRING,
  },
  parentId: {
    type: DataType.UUID,
  },
  key: {
    type: DataType.STRING,
  },
});

FileParent.prototype.getEntity = function getEntity() {
  const model = Model.models[this.parentType];
  return model.findById(this.parentId);
};

export default FileParent;
