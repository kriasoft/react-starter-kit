import { User, UserProfile } from '../../../models';

export const schema = [
  `
  # User profile data for creating a new local database user account
  input UserProfile {
    # A display name for the logged-in user
    displayName: String!

    # A profile picture URL
    picture: String

    # The user's gender
    gender: String

    # The user's location
    location: String

    # A website URL
    website: String
  }
`,
];

export const mutation = [
  `
  # Creates a new user and profile in the local database
  databaseCreateUser(
    # The email of the new user, this email must be unique in the database
    email: String!

    # User profile information for creating a new local database user account
    profile: UserProfile!
  ): DatabaseUser
`,
];

export const resolvers = {
  Mutation: {
    async databaseCreateUser(parent, args) {
      // If user already exists, throw error
      const lookupUser = await User.findOne({ where: { email: args.email } });

      if (lookupUser) {
        // eslint-disable-next-line no-throw-literal
        throw 'User already exists!';
      }

      // Create new user with profile in database
      const user = await User.create(
        {
          email: args.email,
          profile: {
            ...args.profile,
          },
        },
        {
          include: [{ model: UserProfile, as: 'profile' }],
        },
      );

      return user;
    },
  },
};
