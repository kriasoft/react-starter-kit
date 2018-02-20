## How to Use Routing and Navigation

Let's see how routing is implemented using [Universal Router](https://github.com/kriasoft/universal-router)

First, you will need to implement the **list of application routes** in which each route can be
represented as an object with properties of `path` (a parametrized URL path string), `load`
(a function), that loads the corresponding webpack chunck that returns an async `action` function
that can return anything - a string, a React component, etc. For example:

#### `src/routes/index.js`

```js
// The top-level (parent) route
const routes = {
  path: '',

  // Keep in mind, routes are evaluated in order
  children: [
    // The home route is added to client.js to make sure shared components are
    // added to client.js as well and not repeated in individual each route chunk.
    {
      path: '',
      load: () => import(/* webpackChunkName: 'home' */ './home'),
    },
  ],

  async action({ next }) {
    // Execute each child route until one of them return the result
    const route = await next();

    // Provide default values for title, description etc.
    route.title = `${route.title ||
      'Untitled DefaultPage'} - www.reactstarterkit.com`;
    route.description = route.description || '';

    return route;
  },
};

export default routes;
```

#### `src/routes/home/index.js`

```js
import React from 'react';
import Home from '../../components/templates/Home';
import Layout from '../../components/base/Layout';

async function action() {
  return {
    title: 'React Starter Kit',
    component: (
      <Layout>
        <Home />
      </Layout>
    ),
  };
}

export default action;
```

While you can use this as it is on the server, in a browser environment it must be combined with a
client-side navigation solution. This starter kit uses [`history`](https://github.com/ReactTraining/history)
npm module to handle this task. It is a sort of wrapper over
[HTML5 History API](https://developer.mozilla.org/docs/Web/API/History_API) that
handles all the tricky browser compatibility issues related to client-side navigation.

First, we created a `src/history.js` file that initializes a new instance of the `history` module
and exports it as a singleton:

#### `src/history.js`

```js
import createBrowserHistory from 'history/createBrowserHistory';
export default process.env.BROWSER && createBrowserHistory();
```

Second, we use this module in `client.js` to [pass it to our store](../src/client.js#L41) and
[we hook up an onLocationChange](../src/client.js#L156) listner to handle the history state.

Third, use the (`Link`) component to implement any router links. Routerlinks are resolved by
routename that is specified in `../src/routes/index.js`. It can be used as follows:

```jsx
// Route by name
<Link to="/contact">Contact</Link>

// Route by name with params
<Link to="/about" >About</Link>
```

## Specifing a baseUrl

If your app runs in a subdirectory e.g. `https://example.com/subdirectory` specify the subdiretory
name prefixed with a `/` in the `process.env.BASE_URL` runtime variable

### More about the Universal Router.

React Starter Kit (RSK) uses [Universal Router](https://github.com/kriasoft/universal-router) npm
module that is built around the same concepts demonstrated earlier with the major differences that
it supports nested routes and provides you with the helper `Link` React component. It can be seen as
a lightweight more flexible alternative to React Router.

* It has simple code with minimum dependencies (just `path-to-regexp` and `babel-runtime`)
* It can be used with any JavaScript framework such as React, Vue.js etc
* It uses the same middleware approach used in Express and Koa, making it easy to learn
* It uses the exact same API and implementation to be used in both Node.js and browser environments

The [Getting Started page](https://github.com/kriasoft/universal-router/blob/master/docs/getting-started.md)
has a few examples how to use it.

### Related Articles

* [You might not need React Router](https://medium.freecodecamp.com/you-might-not-need-react-router-38673620f3d) by Konstantin Tarkus

### Related Projects

* [`path-to-regexp`](https://github.com/pillarjs/path-to-regexp)
* [`history`](https://github.com/ReactTraining/history)
* [Universal Router](https://github.com/kriasoft/universal-router)

### Related Discussions

* [How to Implement Routing and Navigation](https://github.com/kriasoft/react-starter-kit/issues/748)
