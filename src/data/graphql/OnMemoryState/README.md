# Client State

`./src/state` implies a state only stored on a user machine,
instead of remote database or remote public API, through
`@client` directive in graphql.

Although these are not GraphQL API, components can access to the data
through an apollo client, thanks to `apollo-link-state`.

## Storages

JavaScript memory is one type.

Other type could be LocalStorage, SessionStorage or IndexedDB.

# Other Resources

- [apollo-link-state](https://www.apollographql.com/docs/link/links/state.html)
