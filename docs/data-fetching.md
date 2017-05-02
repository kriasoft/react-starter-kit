## Data Fetching

At a bare minimum you may want to use [HTML5 Fetch API][fetch] as an HTTP client utility for
making Ajax request to the [data API server][nodeapi]. This API is supported natively in all the
major browsers except for IE (note, that Edge browser does support Fetch).

**React Starter Kit** is pre-configured with [`whatwg-fetch`][wfetch] polyfill for the browser
environment and [`node-fetch`][nfetch] module for the server-side environment (see
[`src/createFetch.js`](../src/createFetch.js)), allowing you to use the `fetch(url, options)`
method universally in both the client-side and server-side code bases.

In order to avoid the the amount of boilerplate code needed when using the raw `fetch(..)`
function, a simple wrapper was created that provides a base URL of the data API server, credentials
(cookies), CORS etc. For example, in a browser environment the base URL of the data API server
might be an empty string, so when you make an Ajax request to the `/graphql` endpoint it's being
sent to the same origin, and when the same code is executed on the server, during server-side
rendering, it fetches data from the `http://api:8080/graphql` endpoint (`node-fetch` doesn't
support relative URLs for obvious reasons).

Because of these subtle differences of how the `fetch` method works internally, it makes total
sense to initialize a couple of helper methods for working with data API server (see
[`src/ApiClient.js`][api]) and pass them via `context` to your React application, so it can be used
from either routing level or from inside your React components as follows:

#### Route Example

```js
{
  path: '/posts/:id',
  async action({ params, api }) {
    const resp = await api.fetch(`/api/posts/${params.id}`);
    const data = await resp.json();
    return { title: data.title, component: <Post {...data} /> };
  }
}
```

#### React Component

```js
class Post extends React.Component {
  static contextTypes = {
    api: PropTypes.shape({ fetch: PropTypes.func.isRequired }).isRequired,
  };
  handleDelete = (event) => {
    event.preventDefault();
    const id = event.target.dataset['id'];
    this.context.api.fetch(`/api/posts/${id}`, { method: 'DELETE' }).then(...);
  };
  render() { ... }
}
```

Similarly, you can have a couple of helper functions for working with a GraphQL backend:

#### Route Example /w GraphQL/Relay

```js
import { graphql } from 'relay-runtime';

export default {
  path: '/posts/:id',
  async action({ params, api }) {
    const data = await api.fetchQuery(graphql`
      query PostQuery($id: ID!) {
        post(id: $id) {
          title
          ...Post_post
        }
      }
    `, { id: params.id });

    return {
      title: data.title,
      component: <Post post={data.post} />,
    };
  }
}
```

#### Related articles

* [That's so fetch!](https://jakearchibald.com/2015/thats-so-fetch/) by [Jake Archibald](https://twitter.com/jaffathecake)
* [Getting started with Relay Modern for building isomorphic web apps](https://hackernoon.com/ae049e4e23c1) by [Konstantin Tarkus](https://twitter.com/koistya)


[fetch]: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
[wfetch]: https://github.com/github/fetchno
[nfetch]: https://github.com/bitinn/node-fetch
[nodeapi]: https://github.com/kriasoft/nodejs-api-starter
[api]: ../src/ApiClient.js

