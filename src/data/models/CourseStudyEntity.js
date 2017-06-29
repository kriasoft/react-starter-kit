import DataType from 'sequelize';
import Model from '../sequelize';

const CourseStudyEntity = Model.define('CourseStudyEntity', {

  id: {
    type: DataType.UUID,
    defaultValue: DataType.UUIDV1,
    primaryKey: true,
  },
});

export default CourseStudyEntity;
