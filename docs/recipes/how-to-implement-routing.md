## How to Implement Routing and Navigation [![img](https://img.shields.io/badge/discussion-join-green.svg?style=flat-square)](https://github.com/kriasoft/react-starter-kit/issues/116)

 * [Step 1: Basic Routing](#step-1-basic-routing)
 * [Step 2: Asynchronous Routes](#step-2-asynchronous-routes)
 * [Step 3: Parametrized Routes](#step-3-parametrized-routes)
 * Step 4: Handling Redirects
 * Step 5: Setting Page Title and Meta Tags
 * Step 6: Code Splitting
 * Step 7: Nested Routes
 * Step 8: Integration with Flux
 * Step 9: Server-side Rendering

### Step 1: Basic Routing

In its simplest form the routing looks like a collection or URLs where each URL
is mapped to a React component:

```js
// app.js
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

### Step 2: Asynchronous Routes

Just wrap React components inside your routes into asynchronous functions:

```js
import React from 'react';
import http from './core/http';
import Layout from './components/Layout';
import HomePage from './components/HomePage';
import AboutPage from './components/AboutPage';
import NotFoundPage from './components/NotFoundPage';
import ErrorPage from './components/ErrorPage';

const routes = {
  '/': async () => {
    const data = await http.get('/api/data/home');
    return <Layout><HomePage {...data} /></Layout>
  },
  '/about': async () => {
    const data = await http.get('/api/data/about');
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

### Step 3: Parametrized Routes

**(1)** Convert the list of routes from hash table to an array, this way the
order of routes will be preserved. **(2)** Wrap this collection into a Router
class, where you can put `.match(url)` async method. **(3)** Use [path-to-regexp](https://github.com/pillarjs/path-to-regexp)
to convert Express-like path strings into regular expressions which are used
for matching URL paths to React components.

```js
import React from 'react';
import Router from 'react-routing/src/Router';
import http from './core/HttpClient';
import Layout from './components/Layout';
import ProductListing from './components/ProductListing';
import ProductInfo from './components/ProductInfo';
import NotFoundPage from './components/NotFoundPage';
import ErrorPage from './components/ErrorPage';

const router = new Router(on => {
  on('/products', async () => {
    const data = await http.get('/api/products');
    return <Layout><ProductListing {...data} /></Layout>
  });
  on('/products/:id', async (id) => {
    const data = await http.get(`/api/products/${id}`);
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

### Step 4. Handling Redirects

Coming soon. Stay tuned!
