import { User, UserClaim, UserLogin, UserProfile } from 'data/models';

export const queries = [
  `
  # Retrieves information about the currently logged-in user
  databaseGetLoggedInUser: DatabaseUser
`,
];

export const resolvers = {
  RootQuery: {
    databaseGetLoggedInUser: context => {
      async function getLoggedInUser() {
        // Throw error if user is not authenticated
        if (!context.user) {
          // eslint-disable-next-line no-throw-literal
          throw 'Unauthorized: Access is denied.';
        }

        // Create new user with profile in database
        const newUser = await User.findOne({
          where: { email: context.user.email },
          include: [
            { model: UserLogin, as: 'logins' },
            { model: UserClaim, as: 'claims' },
            { model: UserProfile, as: 'profile' },
          ],
        });

        return newUser;
      }

      return getLoggedInUser()
        .then(user => user)
        .catch(err => {
          throw err;
        });
    },
  },
};
