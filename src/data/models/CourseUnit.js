import DataType from 'sequelize';
import Model from '../sequelize';

const CourseUnit = Model.define('courseUnit', {
  weight: {
    type: DataType.FLOAT,
  },
});
export default CourseUnit;
