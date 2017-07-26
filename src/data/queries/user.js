import { GraphQLString as StringType, GraphQLList as List } from 'graphql';
import bcrypt from 'bcrypt-nodejs';
import UserType from '../types/UserType';
import User from '../models/User';
import UserLogin from '../models/UserLogin';
import UserProfile from '../models/UserProfile';
import UserClaim from '../models/UserClaim';
import sequelize from '../sequelize';

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
  resolve({ request }, args) {
    // return User.create({
    //   email: args.email,
    // })
    return sequelize.transaction(t =>
      User.create(
        {
          type: UserType,
          email: args.email,
          emailConfirmed: false,
          logins: [{ name: 'local', key: args.email }],
          claims: [
            {
              type: 'local',
              value: bcrypt.hashSync(args.key, bcrypt.genSaltSync()),
            },
          ],
          profile: {
            displayName: args.name,
            gender: args.gender,
            picture:
              'https://upload.wikimedia.org/wikipedia/commons/d/d3/User_Circle.png',
          },
        },
        {
          include: [
            { model: UserLogin, as: 'logins' },
            { model: UserClaim, as: 'claims' },
            { model: UserProfile, as: 'profile' },
          ],
          transaction: t,
        },
      ),
    );
  },
};

//  При выполнении этого метода в Graphql вылетает ошибка
const removeUser = {
  type: UserType,
  args: {
    id: {
      description: 'id of the user',
      type: StringType,
    },
  },
  resolve({ request }, args) {
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
  resolve({ request }, args) {
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

export { createUser, users, removeUser, updateUser };
