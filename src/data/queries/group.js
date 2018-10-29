import {
  GraphQLString as StringType,
  GraphQLList as List,
  GraphQLNonNull as NonNull,
} from 'graphql';
import UserType from '../types/UserType';
import { User, Group } from '../models';
import GroupType from '../types/GroupType';

const createGroup = {
  type: GroupType,
  args: {
    title: {
      description: 'The title of the new group',
      type: new NonNull(StringType),
    },
  },
  resolve(parent, args) {
    return Group.create({
      ...args,
    });
  },
};

const removeGroup = {
  type: GroupType,
  args: {
    id: {
      description: 'id of the group',
      type: new NonNull(StringType),
    },
  },
  resolve(parent, args) {
    return Group.findById(args.id)
      .then(group => group.destroy())
      .then(() => {});
  },
};

const updateGroup = {
  type: GroupType,
  args: {
    id: {
      description: 'id of the group',
      type: new NonNull(StringType),
    },
    title: {
      description: 'The title of the group',
      type: StringType,
    },
  },
  resolve(parent, args) {
    return Group.findById(args.id).then(group =>
      group.update({ title: args.title }),
    );
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
      type: new NonNull(StringType),
    },
    groupId: {
      description: 'id of the group',
      type: new NonNull(StringType),
    },
  },
  resolve(obj, args) {
    return User.findById(args.id).then(user =>
      Group.findById(args.groupId).then(group =>
        group.addUser(user).then(() => user),
      ),
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
      Group.findById(args.groupId).then(group =>
        group.removeUser(user).then(() => user),
      ),
    );
  },
};

export {
  groups,
  createGroup,
  removeGroup,
  updateGroup,
  addUserToGroup,
  deleteUserFromGroup,
};
