import {
  validate,
  execute,
  specifiedRules,
} from 'graphql';

import ApolloClient from 'apollo-client';

// Execute all GraphQL requests directly without
class ServerInterface {
  constructor(optionsData) {
    this.schema = optionsData.schema;
    this.optionsData = optionsData;
  }

  async query({ query, variables, operationName }) {
    try {
      let validationRules = specifiedRules;
      const customValidationRules = this.optionsData.validationRules;
      if (customValidationRules) {
        validationRules = validationRules.concat(customValidationRules);
      }

      const validationErrors = validate(this.schema, query, validationRules);
      if (validationErrors.length > 0) {
        return { errors: validationErrors };
      }

      const result = await execute(
        this.schema,
        query,
        this.optionsData.rootValue,
        this.optionsData.context,
        variables,
        operationName,
      );

      return result;
    } catch (contextError) {
      return { errors: [contextError] };
    }
  }
}

export default function createApolloClient(options) {
  return new ApolloClient({
    reduxRootSelector: state => state.apollo,
    networkInterface: new ServerInterface(options),
    queryDeduplication: true,
  });
}
