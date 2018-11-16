function createGraphqlRequest(fetch, user) {
  return async function graphqlRequest(query, variables) {
    const fetchConfig = {
      method: 'post',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query, variables }),
      credentials: 'include',
      user,
    };
    const resp = await fetch('/graphql', fetchConfig);
    if (resp.status !== 200) throw new Error(resp.statusText);
    return resp.json();
  };
}

export default function createHelpers({ fetch, history, user }) {
  return {
    fetch,
    history,
    graphqlRequest: createGraphqlRequest(fetch, user),
  };
}
