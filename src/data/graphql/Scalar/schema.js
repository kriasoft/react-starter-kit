import merge from 'lodash.merge';

import {
  schema as TimestampSchema,
  resolvers as TimestampResolvers,
} from './Timestamp';

export const schema = [...TimestampSchema];

export const resolvers = merge(TimestampResolvers);
