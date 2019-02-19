import { User, UserClaim, UserLogin, UserProfile } from '../../../models';

export const schema = [
  `
  # A user stored in the local database
  type DatabaseUser {
    id: String
    email: String
    emailConfirmed: Boolean
    logins: [DatabaseUserLogin]
    claims: [DatabaseUserClaim]
    profile: DatabaseUserProfile
    updatedAt: String
    createdAt: String
  }

  type DatabaseUserLogin {
    name: String
    key: String
    createdAt: String
    updatedAt: String
    userId: String
  }

  type DatabaseUserClaim {
    id: Int
    type: String
    value: String
    createdAt: String
    updatedAt: String
    userId: String
  }

  type DatabaseUserProfile {
    userId: String
    displayName: String
    picture: String
    gender: String
    location: String
    website: String
    createdAt: String
    updatedAt: String
  }
`,
];

export const queries = [
  `
  # Retrieves all users stored in the local database
  databaseGetAllUsers: [DatabaseUser]

  # Retrieves a single user from the local database
  databaseGetUser(
    # The user's email address
    email: String!
  ): DatabaseUser
`,
];

export const resolvers = {
  RootQuery: {
    async databaseGetAllUsers() {
      const users = await User.findAll({
        include: [
          { model: UserLogin, as: 'logins' },
          { model: UserClaim, as: 'claims' },
          { model: UserProfile, as: 'profile' },
        ],
      });
      return users;
    },
    async databaseGetUser(parent, { email }) {
      const user = await User.findOne({
        where: { email },
        include: [
          { model: UserLogin, as: 'logins' },
          { model: UserClaim, as: 'claims' },
          { model: UserProfile, as: 'profile' },
        ],
      });
      return user;
    },
  },
};
