import {
  GraphQLObjectType as ObjectType,
  GraphQLString as StringType,
  GraphQLNonNull as NonNull,
  GraphQLList,
  GraphQLID as ID,
} from 'graphql';
import StudyEntityType from './StudyEntityType';
import Course from '../models/Course';
import UserCourse from '../models/UserCourse';
import User from '../models/User';

const CourseType = new ObjectType({
  name: 'CourseType',
  fields: {
    id: { type: new NonNull(StringType) },
    title: { type: new NonNull(StringType) },
    studyEntities: {
      type: new GraphQLList(StudyEntityType),
      resolve: course => course.getStudyEntities(),
    },
    users: {
      type: new GraphQLList(
        new ObjectType({
          name: 'CourseUserType',
          fields: {
            id: { type: new NonNull(ID) },
            email: { type: StringType },
            role: { type: StringType },
          },
        }),
      ),
      resolve: course =>
        Course.find({
          where: { id: course.id },
          include: [{ model: User, as: 'users', through: UserCourse }],
        }).then(c =>
          c.users.map(user => ({
            id: user.id,
            email: user.email,
            role: user.UserCourse.role,
          })),
        ),
    },
  },
});

export default CourseType;
