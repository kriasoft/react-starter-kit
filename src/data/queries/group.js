import {
  GraphQLString as StringType,
  GraphQLList as List,
  GraphQLNonNull as NonNull,
} from 'graphql';
import UserType from '../types/UserType';
import { User, Group } from '../models';
import GroupType from '../types/GroupType';
import { NotLoggedInError, NoAccessError } from '../../errors';

const createGroup = {
  type: GroupType,
  args: {
    title: {
      description: 'The title of the new group',
      type: new NonNull(StringType),
    },
  },
  resolve({ request }, args) {
    if (!request.user) throw new NotLoggedInError();
    // TODO: for now only admin can create/edit groups
    if (!request.user.isAdmin) throw new NoAccessError();
    return Group.create({
      ...args,
    });
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
  resolve({ request }, args) {
    if (!request.user) throw new NotLoggedInError();
    // TODO: for now only admin can create/edit groups
    if (!request.user.isAdmin) throw new NoAccessError();
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
  async resolve({ request }, args) {
    let gr;
    if (args.ids) {
      gr = await Group.findAll({
        where: {
          id: args.ids,
        },
      });
    }
    gr = await Group.findAll();
    for (let i = 0; i < gr.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      if (!(await gr[i].canRead(request.user))) throw new NoAccessError();
    }
    return gr;
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
  resolve({ request }, args) {
    if (!request.user) throw new NotLoggedInError();
    // TODO: for now only admin can create/edit groups
    if (!request.user.isAdmin) throw new NoAccessError();
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
  resolve({ request }, args) {
    if (!request.user) throw new NotLoggedInError();
    // TODO: for now only admin can create/edit groups
    if (!request.user.isAdmin) throw new NoAccessError();
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
  updateGroup,
  addUserToGroup,
  deleteUserFromGroup,
};
