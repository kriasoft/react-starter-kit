## How Routing and Navigation Work [![img](https://img.shields.io/badge/discussion-join-green.svg?style=flat-square)](https://github.com/kriasoft/react-starter-kit/issues/116)

*Warning! The following needs to be carefully vetted, since it was written by a beginner, not an expert.*

The react-starter-kit showcases a broad range of routing techniques. Like all Express applications, the routing is handled by comparing the path portion of the URL to a list of handlers. If there is a match, the handler returns data to be displayed.

The react-starter-kit will handle these requests, using the techniques described below: 

* **Rendering data using React components** Individual React components are served from `src/components`; entire pages from `src/routes`.  

* **Rendering static text, image, or xml files.** These files are served from the src/public directory. 

* **Rendering Jade, Markdown, or HTML files.** These are served from the `src/content` directory. 

* **Use cookies to build sessions using expressJwt.** *Not entirely sure how this works - supports cookies that enable a login session?*

* **Authentication using Facebook.** *Not entirely sure how this works - get credentials from Facebook, then set a cookie to create a session?*

* **Retrieving data via GraphQL** GraphQL is a query language for requesting data from a remote site. It is useful for creating APIs. In react-starter-kit, it is used to retrieve the news items for the main page from a remote RSS feed, and also search the `src/content` directory for Jade, Markdown, and HTML files to render.

#### The Order of Processing URL requests

Two Javascript files control the routing of requests to the application: `server.js` and `routes.js`. When a request arrives, react-starter-kit processes it in this order:

*Is this correct?*

1. Static files from `src/public` This handler is registered in `server.js`, near the "Register Node.js middleware" comment.
2. Handle cookie-based authentication with expressJwt, in `server.js` near "Authentication" comment.
3. Handle Facebook login requests (to `/login/facebook` and `login/facebook/return`), acquiring a cookie for the session. 
4. Set up a handler for `/graphql` requests. When triggered, `server.js` retrieves data for the specified request.
5. Handle server-side rendering middleware for all paths (`'*'`) that have not already been handled. This passes the request to the `routes.js` file to handle all React components.
6. In `routes.js`, the initial `on('*', ...)` handler passes the request to the "next" route in order, then wraps the returned component in an `<App>...</App>` component.
7. The request gets check against a list of `routes`; if one matches, its component is returned. 
8. The next `on('*', ...)` handler converts the path into a `/graphql` request (to handle Jade, Markdown, or HTML files)
9. The `on('error', ...)` handler returns a 404 or other error page in response to an error being detected.

---
The original page starts here...

 * [Step 1: Basic Routing](#step-1-basic-routing)
 * [Step 2: Asynchronous Routes](#step-2-asynchronous-routes)
 * [Step 3: Parameterized Routes](#step-3-parameterized-routes)
 * Step 4: Handling Redirects
 * Step 5: Setting Page Title and Meta Tags
 * Step 6: Code Splitting
 * Step 7: Nested Routes
 * Step 8: Integration with Flux
 * Step 9: Server-side Rendering

### Step 1: Basic Routing

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

### Step 2: Asynchronous Routes

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

### Step 3: Parameterized Routes

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

### Step 4. Handling Redirects

Coming soon. Stay tuned!
