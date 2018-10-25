import DataType from 'sequelize';
import Model from '../sequelize';

const UserCourse = Model.define('userCourse', {
  role: {
    type: DataType.ENUM('teacher', 'student'),
    allowNull: false,
    defaultValue: 'student',
  },
});

export default UserCourse;
