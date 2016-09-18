import {
  GraphQLString as StringType,
  GraphQLNonNull as NonNull,
} from 'graphql';
import jwt from 'jsonwebtoken';
import UserType from '../types/UserType';
import ErrorType from '../types/ErrorType';
import { User } from '../models';
import { auth } from '../../config';

const userLogin = {
  type: UserType,
  fields: {
    user: { type: StringType },
    errors: { type: ErrorType },
  },
  args: {
    usernameOrEmail: { type: new NonNull(StringType) },
    password: { type: new NonNull(StringType) },
  },
  resolve: async (root, { usernameOrEmail, password }) => {
    const errors = [];
    const usernameOrEmailLC = usernameOrEmail.toLowerCase();

    const user = await User.findOne({
      attributes: ['id', 'username', 'email'],
      where: {
        $or: [{ username: usernameOrEmailLC }, { email: usernameOrEmailLC }],
      },
    });

    if (user && user.comparePassword(password)) {
      user.token = jwt.sign({ id: user.id }, auth.jwt.secret, { expiresIn: auth.jwt.expires });
    } else {
      errors.push({ key: 'general', message: 'Invalid credentials' });
    }

    return {
      user,
      errors,
    };
  },
};

export default userLogin;
