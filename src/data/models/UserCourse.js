import DataType from 'sequelize';
import Model from '../sequelize';

const UserCourse = Model.define('userCourse', {
  role: {
    type: DataType.STRING(255),
  },
});

export default UserCourse;
