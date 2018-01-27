import {
  GraphQLObjectType as ObjectType,
  GraphQLString as StringType,
  GraphQLNonNull as NonNull,
  GraphQLList,
  GraphQLID as ID,
} from 'graphql';
import User from '../models/User';
import Group from '../models/Group';
import UserGroup from '../models/UserGroup';

const GroupType = new ObjectType({
  name: 'GroupType',
  fields: {
    id: { type: new NonNull(StringType) },
    title: {
      type: new NonNull(StringType),
    },
    users: {
      type: new GraphQLList(
        new ObjectType({
          name: 'GroupUserType',
          fields: {
            id: { type: new NonNull(ID) },
            email: { type: StringType },
            role: { type: StringType },
          },
        }),
      ),
      resolve: group =>
        Group.find({
          where: { id: group.id },
          include: [{ model: User, as: 'users', through: UserGroup }],
        }).then(c =>
          c.users.map(user => ({
            id: user.id,
            email: user.email,
            role: user.role,
          })),
        ),
    },
  },
});

export default GroupType;
