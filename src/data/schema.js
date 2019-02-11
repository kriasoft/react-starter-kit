/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import merge from 'lodash.merge';

import {
  schema as NewsSchema,
  resolvers as NewsResolvers,
  queries as NewsQueries,
} from './graphql/News/schema';

import {
  schema as DatabaseSchema,
  resolvers as DatabaseResolvers,
  mutations as DatabaseMutations,
  queries as DatabaseQueries,
} from './graphql/Database/schema';

import {
  schema as TimestampSchema,
  resolvers as TimestampResolvers,
} from './graphql/Scalar/Timestamp';

import {
  schema as OnMemoryStateSchema,
  queries as OnMemoryStateQueries,
  mutations as OnMemoryStateMutations,
} from './graphql/OnMemoryState/schema';

const RootQuery = [
  `
  
  # # React-Starter-Kit Querying API
  # ### This GraphQL schema was built with [Apollo GraphQL-Tools](https://github.com/apollographql/graphql-tools)
  # _Build, mock, and stitch a GraphQL schema using the schema language_
  #
  # **[Schema Language Cheet Sheet](https://raw.githubusercontent.com/sogko/graphql-shorthand-notation-cheat-sheet/master/graphql-shorthand-notation-cheat-sheet.png)**
  #
  # 1. Use the GraphQL schema language to [generate a schema](https://www.apollographql.com/docs/graphql-tools/generate-schema.html) with full support for resolvers, interfaces, unions, and custom scalars. The schema produced is completely compatible with [GraphQL.js](https://github.com/graphql/graphql-js).
  # 2. [Mock your GraphQL API](https://www.apollographql.com/docs/graphql-tools/mocking.html) with fine-grained per-type mocking
  # 3. Automatically [stitch multiple schemas together](https://www.apollographql.com/docs/graphql-tools/schema-stitching.html) into one larger API
  type RootQuery {
    ${NewsQueries}
    ${DatabaseQueries}
    ${OnMemoryStateQueries}
  }
`,
];

const Mutation = [
  `
  # # React-Starter-Kit Mutating API
  # ### This GraphQL schema was built with [Apollo GraphQL-Tools](https://github.com/apollographql/graphql-tools)
  # _Build, mock, and stitch a GraphQL schema using the schema language_
  #
  # **[Schema Language Cheet Sheet](https://raw.githubusercontent.com/sogko/graphql-shorthand-notation-cheat-sheet/master/graphql-shorthand-notation-cheat-sheet.png)**
  #
  # 1. Use the GraphQL schema language to [generate a schema](https://www.apollographql.com/docs/graphql-tools/generate-schema.html) with full support for resolvers, interfaces, unions, and custom scalars. The schema produced is completely compatible with [GraphQL.js](https://github.com/graphql/graphql-js).
  # 2. [Mock your GraphQL API](https://www.apollographql.com/docs/graphql-tools/mocking.html) with fine-grained per-type mocking
  # 3. Automatically [stitch multiple schemas together](https://www.apollographql.com/docs/graphql-tools/schema-stitching.html) into one larger API
  type Mutation {
    ${DatabaseMutations}
    ${OnMemoryStateMutations}
  }
`,
];

const SchemaDefinition = [
  `
  
  schema {
    query: RootQuery
    mutation: Mutation
  }
`,
];

// Merge all of the resolver objects together
// Put schema together into one array of schema strings
const resolvers = merge(NewsResolvers, DatabaseResolvers, TimestampResolvers);

const schema = [
  ...SchemaDefinition,
  ...TimestampSchema,
  ...RootQuery,
  ...Mutation,

  ...NewsSchema,
  ...DatabaseSchema,
  ...OnMemoryStateSchema,
];

export default {
  typeDefs: schema,
  resolvers,
  ...(__DEV__ ? { log: e => console.error(e.stack) } : {}),
};
