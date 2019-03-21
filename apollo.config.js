const { codegenPort } = require('./src/config');

module.exports = {
  client: {
    service: {
      name: 'react-starter-kit',
      url: `http://localhost:${codegenPort}/graphql`,
      // optional headers
      headers: {
        // authorization: 'Bearer lkjfalkfjadkfjeopknavadf',
      },
      // optional disable SSL validation check
      skipSSLValidation: true,
    },
  },
};
