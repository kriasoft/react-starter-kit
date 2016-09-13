import UserType from '../types/UserType';

const userLogout = {
  type: UserType,
  resolve({ res }) {
    res.clearCookie('id-token');
  },
};

export default userLogout;
