module.exports = {
  client: {
    service: {
      name: 'react-starter-kit',
      url: 'http://localhost:3000/graphql',
      // optional headers
      headers: {
        // authorization: 'Bearer lkjfalkfjadkfjeopknavadf',
      },
      // optional disable SSL validation check
      skipSSLValidation: true,
    },
  },
};
