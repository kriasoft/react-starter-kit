import { GraphQLString as StringType, GraphQLList as List } from 'graphql';
import UserType from '../types/UserType';
import User from '../models/User';
import GroupType from '../types/GroupType';
import Group from '../models/Group';

const createGroup = {
  type: GroupType,
  args: {
    title: {
      description: 'The title of the new group',
      type: StringType,
    },
  },
  resolve(parent, args) {
    return Group.create({
      title: args.title,
    });
  },
};

const removeGroup = {
  type: GroupType,
  args: {
    id: {
      description: 'id of the group',
      type: StringType,
    },
  },
  resolve(parent, args) {
    return Group.destroy({
      where: {
        id: args.id,
      },
    });
  },
};

const groups = {
  type: new List(GroupType),
  args: {
    ids: {
      description: 'ids of the group',
      type: new List(StringType),
    },
  },
  resolve(obj, args) {
    if (args.ids) {
      return Group.findAll({
        where: {
          id: args.ids,
        },
      });
    }
    return Group.findAll();
  },
};

const addUserToGroup = {
  type: UserType,
  args: {
    id: {
      description: 'id of the user',
      type: StringType,
    },
    groupId: {
      description: 'id of the group',
      type: StringType,
    },
  },
  resolve(obj, args) {
    return User.findById(args.id).then(user =>
      user.addGroup(args.groupId).then(() => user),
    );
  },
};

const deleteUserFromGroup = {
  type: UserType,
  args: {
    id: {
      description: 'id of the user',
      type: StringType,
    },
    groupId: {
      description: 'id of the group',
      type: StringType,
    },
  },
  resolve(obj, args) {
    return User.findById(args.id).then(user =>
      user.removeGroup(args.groupId).then(() => user),
    );
  },
};

export {
  groups,
  createGroup,
  removeGroup,
  addUserToGroup,
  deleteUserFromGroup,
};
