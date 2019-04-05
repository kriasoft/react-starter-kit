export const defaults = {
  networkStatus: {
    __typename: 'NetworkStatus',
    isConnected: true,
  },
};

export const resolvers = {
  Mutation: {
    updateNetworkStatus: (_: any, { isConnected }: any, { cache }: any) => {
      const data = {
        networkStatus: {
          __typename: 'NetworkStatus',
          isConnected,
        },
      };
      cache.writeData({ data });
      return null;
    },
  },
};

export const schema = [
  `
  type NetworkStatus {
    isConnected: Boolean!
  }
`,
];

export const queries = [
  `
  networkStatus: NetworkStatus!
`,
];

export const mutations = [
  `
  updateNetworkStatus(isConnected: Boolean): NetworkStatus!
`,
];
