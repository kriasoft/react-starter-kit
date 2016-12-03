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

const login = {
  type: new ObjectType({
    name: 'loginResult',
    fields: {
      data: {
        type: new ObjectType({
          name: 'loginResultData',
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
    usernameOrEmail: { type: new NonNull(StringType) },
    password: { type: new NonNull(StringType) },
  },
  async resolve(root, { usernameOrEmail, password }) {
    let token = null;
    const errors = [];

    const usernameOrEmailLC = usernameOrEmail.toLowerCase();
    const user = await User.findOne({
      where: {
        $or: [{ username: usernameOrEmailLC }, { email: usernameOrEmailLC }],
      },
    });

    if (user && user.comparePassword(password)) {
      token = jwt.sign({ id: user.id }, auth.jwt.secret, { expiresIn: auth.jwt.expires });
    } else {
      errors.push({ key: 'general', message: 'Invalid credentials' });
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

const me = {
  type: UserType,
  resolve() {
    return User.findById(1);
  },
};

export default { login, me };
