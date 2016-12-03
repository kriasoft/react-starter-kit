import {
  GraphQLObjectType as ObjectType,
  GraphQLNonNull as NonNull,
  GraphQLString as StringType,
} from 'graphql';
import jwt from 'jsonwebtoken';
import UserType from '../types/UserType';
import ErrorType from '../types/ErrorType';
import { User } from '../models';
import { auth } from '../../config';

const signup = {
  type: new ObjectType({
    name: 'signupResult',
    fields: {
      data: {
        type: new ObjectType({
          name: 'signupResultData',
          fields: {
            user: {
              type: UserType,
            },
            token: {
              type: StringType,
            },
          },
        }),
      },
      errors: {
        type: ErrorType,
      },
    },
  }),
  args: {
    username: { type: new NonNull(StringType) },
    email: { type: new NonNull(StringType) },
    password: { type: new NonNull(StringType) },
  },
  async resolve(root, { username, email, password }) {
    let user = null;
    let token = null;
    const errors = [];

    if (password.length < 8) {
      errors.push({ key: 'password', message: 'Password must be at least 8 characters long' });
    }

    // check to see if there's already a user with that email
    const count = await User.count({ where: { email } });

    if (count > 0) {
      errors.push({ key: 'email', message: 'User with this email already exists' });
    }

    if (errors.length === 0) {
      user = await User.create({
        username,
        email: email.toLowerCase(),
        password: User.generateHash(password),
      });

      token = jwt.sign({ id: user.id }, auth.jwt.secret, { expiresIn: auth.jwt.expires });

      user = await User.findOne({
        where: { email },
      });
    }

    const data = {
      user,
      token,
    };

    return {
      data,
      errors,
    };
  },
};

export default { signup };
