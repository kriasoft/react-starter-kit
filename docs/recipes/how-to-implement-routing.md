## How to Implement Routing and Navigation

Let's see how a custom routing solution under 100 lines of code may look like.

First, you will need to implement the **list of application routes** in which each route can be
represented as an object with properties of `path` (a parametrized URL path string), `action`
(a function), and optionally `children` (a list of sub-routes, each of which is a route object). 
The `action` function returns anything - a string, a React component, etc. For example:

#### `src/routes/index.js`

```js
export default [
  {
    path: '/tasks',
    action() {
      const resp = await fetch('/api/tasks');
      const data = await resp.json();
      return data && {
        title: `To-do (${data.length})`,
        component: <TodoList {...data} />
      };
    }
  },
  {
    path: '/tasks/:id',
    action({ params }) {
      const resp = await fetch(`/api/tasks/${params.id}`);
      const data = await resp.json();
      return data && {
        title: data.title,
        component: <TodoItem {...data} />
      };
    }
  }
];
```

Next, implement a **URL Matcher** function that will be responsible for matching a parametrized
path string to the actual URL. For example, calling `matchURI('/tasks/:id', '/tasks/123')` must
return `{ id: '123' }` while calling `matchURI('/tasks/:id', '/foo')` must return `null`.
Fortunately, there is a great library called [`path-to-regexp`](https://github.com/pillarjs/path-to-regexp)
that makes this task very easy. Here is how a URL matcher function may look like:

#### `src/core/router.js`

```js
import toRegExp from 'path-to-regexp';

function matchURI(path, uri) {
  const keys = [];
  const pattern = toRegExp(path, keys); // TODO: Use caching
  const match = pattern.exec(uri);
  if (!match) return null;
  const params = Object.create(null);
  for (let i = 1; i < match.length; i++) {
    params[keys[i - 1].name] =
      match[i] !== undefined ? match[i] : undefined;
  }
  return params;
}
```

Finally, implement a **Route Resolver** function that given a list of routes and a URL/context
should find the first route matching the provided URL string, execute its action method, and if the
action method returns anything other than `null` or `undefined` return that to the caller.
Otherwise, it should continue iterating over the remaining routes. If none of the routes match to the
provided URL string, it should throw an exception (Not found). Here is how this function may look like:

#### `src/core/router.js`

```js
import toRegExp from 'path-to-regexp';

function matchURI(path, uri) { ... } // See above

async function resolve(routes, context) {
  for (const route of routes) {
    const uri = context.error ? '/error' : context.pathname;
    const params = matchURI(route.path, uri);
    if (!params) continue;
    const result = await route.action({ ...context, params });
    if (result) return result;
  }
  const error = new Error('Not found');
  error.status = 404;
  throw error;
}

export default { resolve };
```

That's it! Here is a usage example:

```js
import router from './core/router';
import routes from './routes';

router.resolve(routes, { pathname: '/tasks' }).then(result => {
  console.log(result);
  // => { title: 'To-do', component: <TodoList .../> } 
});
```

While you can use this as it is on the server, in a browser environment it must be combined with a
client-side navigation solution. You can use [`history`](https://github.com/ReactTraining/history)
npm module to handles this task for you. It is the same library used in React Router, sort of a
wrapper over [HTML5 History API](https://developer.mozilla.org/docs/Web/API/History_API) that
handles all the tricky browser compatibility issues related to client-side navigation.

First, create `src/core/history.js` file that will initialize a new instance of the `history` module
and export is as a singleton:

#### `src/core/history.js`

```js
import createHistory from 'history/lib/createBrowserHistory';
import useQueries from 'history/lib/useQueries';
export default useQueries(createHistory)();
```

Then plug it in, in your client-side bootstrap code as follows:

#### `src/client.js`

```js
import ReactDOM from 'react-dom';
import history from './core/history';
import router from './core/router';
import routes from './routes';

const container = document.getElementById('root');

function renderRouteOutput({ title, component }) {
  ReactDOM.render(component, container, () => {
    document.title = title;
  });
}

function render(location) {
  router.resolve(routes, location)
    .then(renderRouteOutput)
    .catch(error => router.resolve(routes, { ...location, error })
    .then(renderRouteOutput));
}

render(history.getCurrentLocation()); // render the current URL
history.listen(render);
```

Whenever a new location is pushed into the `history` stack, the `render()` method will be called,
that itself calls the router's `resolve()` method and renders the returned from it React component
into the DOM.

In order to trigger client-side navigation without causing full-page refresh, you need to use
`history.push()` method, for example:

```js
import React from 'react';
import history from '../core/history';

class App extends React.Component {
  transition = event => {
    event.preventDefault();
    history.push({
      pathname: event.currentTarget.pathname,
      search: event.currentTarget.search
    });
  };
  render() {
    return (
      <ul>
        <li><a href="/" onClick={this.transition}>Home</a></li>
        <li><a href="/one" onClick={this.transition}>One</a></li>
        <li><a href="/two" onClick={this.transition}>Two</a></li>
      </ul>
    );
  }
}
```

Though, it is a common practice to extract that transitioning functionality into a stand-alone
(`Link`) component that can be used as follows:
 
```html
<Link to="/tasks/123">View Task #123</Link> 
```

### Routing in React Starter Kit

React Starter Kit (RSK) uses [Universal Router](https://github.com/kriasoft/universal-router) npm
module that is built around the same concepts demonstrated earlier with the major differences that
it supports nested routes and provides you with the helper `Link` React component. It can be seen as
a lightweight more flexible alternative to React Router.

- It has simple code with minimum dependencies (just `path-to-regexp` and `babel-runtime`)
- It can be used with any JavaScript framework such as React, Vue.js etc
- It uses the same middleware approach used in Express and Koa, making it easy to learn
- It uses the exact same API and implementation to be used in both Node.js and browser environments

The [Getting Started page](https://github.com/kriasoft/universal-router/blob/master/docs/getting-started.md)
has a few examples how to use it.

### Related Articles

- [You might not need React Router](https://medium.freecodecamp.com/you-might-not-need-react-router-38673620f3d) by Konstantin Tarkus

### Related Projects

- [`path-to-regexp`](https://github.com/pillarjs/path-to-regexp)
- [`history`](https://github.com/ReactTraining/history)
- [Universal Router](https://github.com/kriasoft/universal-router)

### Related Discussions

- [How to Implement Routing and Navigation](https://github.com/kriasoft/react-starter-kit/issues/748)
- [How to Add a Route to RSK?](https://github.com/kriasoft/react-starter-kit/issues/754)
