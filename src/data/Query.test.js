/* eslint-env jest */
/* eslint-disable padded-blocks, no-unused-expressions */

import EasyGraphQLTester from 'easygraphql-tester';
import schema from './schema';

describe('Test my GraphQL queries', () => {
  let tester;

  beforeAll(() => {
    tester = new EasyGraphQLTester(schema);
  });

  describe('Query me', () => {
    test('Invalid field on me', () => {
      const invalidQuery = `
        {
          me {
            id
            fullName
          }
        }
      `;
      // First arg: false, there is no field fullName
      // Second arg: query to test
      tester.test(false, invalidQuery);
    });

    test('Should pass valid query me', () => {
      const validQuery = `
        {
          me {
            id
            email
          }
        }
      `;
      tester.test(true, validQuery);
    });
  });

  describe('Query news', () => {
    test('Invalid field on news', () => {
      const invalidQuery = `
          {
            news {
              title
              linkUrl
            }
          }
        `;
      // First arg: false, there is no field linkUrl, it is link
      // Second arg: query to test
      tester.test(false, invalidQuery);
    });

    test('Should pass valid query news', () => {
      const validQuery = `
          {
            news {
              title
              link
              author
            }
          }
        `;
      tester.test(true, validQuery);
    });
  });
});
