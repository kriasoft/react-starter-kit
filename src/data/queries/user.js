import {
  GraphQLString as StringType,
  GraphQLList as List,
  GraphQLID as ID,
  GraphQLNonNull as NonNull,
} from 'graphql';

import UserType from '../types/UserType';
import User from '../models/User';

const createUser = {
  type: UserType,
  args: {
    email: {
      description: 'The email of the new user',
      type: StringType,
    },
    key: {
      description: 'The key of the new user',
      type: StringType,
    },
    name: {
      description: 'The name of the new user',
      type: StringType,
    },
    gender: {
      description: 'The gender of the new user',
      type: StringType,
    },
  },
  resolve(parent, args) {
    return User.createUser(args);
  },
};

const setPassword = {
  type: UserType,
  args: {
    id: { type: new NonNull(ID) },
    newPassword: { type: StringType },
  },
  resolve(parent, args) {
    return User.findById(args.id).then(user => {
      user.setPassword.call(user, args.newPassword);
      return user;
    });
  },
};

// when this method is called there is crash in GraphQL
const removeUser = {
  type: UserType,
  args: {
    id: {
      description: 'id of the user',
      type: StringType,
    },
  },
  resolve(parent, args) {
    return User.destroy({
      where: {
        id: args.id,
      },
    });
  },
};

const users = {
  type: new List(UserType),
  args: {
    ids: {
      description: 'ids of the user',
      type: new List(StringType),
    },
  },
  resolve(obj, args) {
    if (args.ids) {
      return User.findAll({
        where: {
          id: args.ids,
        },
      });
    }
    return User.findAll();
  },
};

const updateUser = {
  type: UserType,
  args: {
    id: {
      description: 'id of the user',
      type: StringType,
    },
    email: {
      description: 'The email of the user',
      type: StringType,
    },
  },
  resolve(parent, args) {
    let user;
    User.findById(args.id).then(_user => {
      user = _user;
      if (args.email) {
        user.email = args.email;
      }
      return user.save();
    });
  },
};

export { createUser, users, removeUser, updateUser, setPassword };
