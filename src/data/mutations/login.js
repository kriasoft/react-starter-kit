
import {
  GraphQLString as StringType,
  GraphQLNonNull as NonNull,
} from 'graphql';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

import { User } from '../models';
import { auth } from '../../config';
import UserType from '../types/UserType';

const login = {
  type: UserType,
  args: {
    usernameOrEmail: { type: new NonNull(StringType) },
    password: { type: new NonNull(StringType) },
  },
  async resolve({ request }, { usernameOrEmail, password }) {
    const usernameOrEmailLC = usernameOrEmail.toLowerCase();
    const passwordHashed = bcrypt.hashSync(password.trim(), 10);

    const user = User.findOne({
      attributes: ['id', 'email', 'username'],
      where: {
        $or: [{ username: usernameOrEmailLC }, { email: usernameOrEmailLC }],
        password: passwordHashed,
      },
    });

    if (!user) {
      throw new Error('username/email or password is wrong');
    }
    user.token = jwt.sign({ id: user.id }, auth.jwt.secret, { expiresIn: auth.jwt.expires });
    return user;
  },
};

export default login;
