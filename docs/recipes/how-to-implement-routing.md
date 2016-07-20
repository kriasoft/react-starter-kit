## How to Implement Routing and Navigation

_This is a placeholder page to describe the current state of routing in React Starter Kit. It replaces the outdated/deprecated info at the bottom of this page._

React Starter Kit (RSK) uses [universal-router](https://github.com/kriasoft/universal-router) for routing. Its benefits over react-router are:

- It has simple code with minimum dependencies (just path-to-regexp and babel-runtime)
- It can be used with any JavaScript framework such as React, Vue.js etc
- It uses the same middleware approach used in Express and Koa, making it easy to learn

The universal-router [Getting Started](https://github.com/kriasoft/universal-router/blob/master/docs/getting-started.md) page contains this key paragraph that describes the fundamentals of universal-router operation:

> This module contains a resolve() function that responsible for traversing the list of routes, until it finds the first route matching the provided URL path string and whose action method returns anything other than undefined. Each route is just a plain JavaScript object having path, action, and children (optional) properties.

There are several important points here:

1. universal-router scans a list (array) of routes to find the code to handle the request.
2. Each route is an object with properties of `path` (a string), `action` (a function), and optionally `children` (a list of sub-routes, each of which is a route object.)
3. The `action` function returns anything - a string, a React component, etc. which universal-router passes along.

The [Getting Started page](https://github.com/kriasoft/universal-router/blob/master/docs/getting-started.md) has example code that illustrates those points. 

If you're using RSK, read the two notes (below) that give information about using universal-router:

- [How to Implement Routing and Navigation](https://github.com/kriasoft/react-starter-kit/issues/748)
- [How to Add a Route to RSK?](https://github.com/kriasoft/react-starter-kit/issues/754)

For more information, you can review [You might not need React Router](https://medium.freecodecamp.com/you-might-not-need-react-router-38673620f3d) or ask questions on the [universal-router group on Gitter.](https://gitter.im/kriasoft/universal-router)

---------
_**DEPRECATION NOTICE** This page formerly contained the information below. With the arrival of `universal-router` in react-starter-kit, these descriptions are no longer correct._

[![img](https://img.shields.io/badge/discussion-join-green.svg?style=flat-square)](https://github.com/kriasoft/react-starter-kit/issues/116)

 * [Step 1: Basic Routing](#step-1-basic-routing)
 * [Step 2: Asynchronous Routes](#step-2-asynchronous-routes)
 * [Step 3: Parameterized Routes](#step-3-parameterized-routes)
 * Step 4: Handling Redirects
 * Step 5: Setting Page Title and Meta Tags
 * Step 6: Code Splitting
 * Step 7: Nested Routes
 * Step 8: Integration with Flux
 * Step 9: Server-side Rendering

### Step 1: OUTDATED ~~Basic Routing~~

In its simplest form the routing looks like a collection of URLs where each URL
is mapped to a React component:

```js
// client.js
import React from 'react';
import Layout from './components/Layout';
import HomePage from './components/HomePage';
import AboutPage from './components/AboutPage';
import NotFoundPage from './components/NotFoundPage';
import ErrorPage from './components/ErrorPage';

const routes = {
  '/':      <Layout><HomePage /></Layout>,
  '/about': <Layout><AboutPage /></Layout>
};

const container = document.getElementById('app');

function render() {
  try {
    const path = window.location.hash.substr(1) || '/';
    const component = routes[path] || <NotFoundPage />;
    React.render(component, container);
  } catch (err) {
    React.render(<ErrorPage {...err} />, container);
  }
}

window.addEventListener('hashchange', () => render());
render();
```

### Step 2: OUTDATED ~~Asynchronous Routes~~

Just wrap React components inside your routes into asynchronous functions:

```js
import React from 'react';
import fetch from './core/fetch';
import Layout from './components/Layout';
import HomePage from './components/HomePage';
import AboutPage from './components/AboutPage';
import NotFoundPage from './components/NotFoundPage';
import ErrorPage from './components/ErrorPage';

const routes = {
  '/': async () => {
    const response = await fetch('/graphql?query={content(path:"/"){title,html}}');
    const data = await response.json();
    return <Layout><HomePage {...data} /></Layout>
  },
  '/about': async () => {
    const response = await fetch('/graphql?query={content(path:"/about"){title,html}}');
    const data = await response.json();
    return <Layout><AboutPage {...data} /></Layout>;
  }
};

const container = document.getElementById('app');

async function render() {
  try {
    const path = window.location.hash.substr(1) || '/';
    const route = routes[path];
    const component = route ? await route() : <NotFoundPage />;
    React.render(component, container);
  } catch (err) {
    React.render(<ErrorPage {...err} />, container);
  }
}

window.addEventListener('hashchange', () => render());
render();
```

### Step 3: OUTDATED ~~Parameterized Routes~~ 

**(1)** Convert the list of routes from hash table to an array, this way the
order of routes will be preserved. **(2)** Wrap this collection into a Router
class, where you can put `.match(url)` async method. **(3)** Use [path-to-regexp](https://github.com/pillarjs/path-to-regexp)
to convert Express-like path strings into regular expressions which are used
for matching URL paths to React components.

```js
import React from 'react';
import Router from 'react-routing/src/Router';
import fetch from './core/fetch';
import Layout from './components/Layout';
import ProductListing from './components/ProductListing';
import ProductInfo from './components/ProductInfo';
import NotFoundPage from './components/NotFoundPage';
import ErrorPage from './components/ErrorPage';

const router = new Router(on => {
  on('/products', async () => {
    const response = await fetch('/graphql?query={products{id,name}}');
    const data = await response.json();
    return <Layout><ProductListing {...data} /></Layout>
  });
  on('/products/:id', async ({ params }) => {
    const response = await fetch('/graphql?query={product(id:"${params.id}"){name,summary}}');
    const data = await response.json();
    return <Layout><ProductInfo {...data} /></Layout>;
  });
}]);

const container = document.getElementById('app');

async function render() {
  const state = { path: window.location.hash.substr(1) || '/' };
  await router.dispatch(state, component => {
    React.render(component, container);
  });
}

window.addEventListener('hashchange', () => render());
render();
```

### Step 4. OUTDATED ~~Handling Redirects~~

Coming soon. Stay tuned!
