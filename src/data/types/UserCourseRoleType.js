import { GraphQLEnumType } from 'graphql';

const UserCourseRoleType = new GraphQLEnumType({
  name: 'UserCourseRole',
  values: {
    student: {
      value: 'student',
    },
    teacher: {
      value: 'teacher',
    },
  },
});

export default UserCourseRoleType;
