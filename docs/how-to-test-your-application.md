## Testing your application

### Used libraries

RSK comes with the following libraries for testing purposes:

* [Jest](https://facebook.github.io/jest/) - Zero configuration testing platform
* [Enzyme](https://github.com/airbnb/enzyme) - Testing utilities for React

You may also want to take a look at the following related packages:

* [jsdom](https://github.com/tmpvar/jsdom)

### Running tests

To test your application simply run the
[`yarn test`](../package.json#L120)
command which will:

* recursively find all files ending with `.test.js` in your `src/` directory
* jest executes found files

```bash
yarn test
```

Alternatively, you can run the
[`yarn test-watch`](../package.json#L121)
command which will:

* recursively find all files ending with `.test.js` in your `src/` directory
* jest executes found files
* [watches](https://facebook.github.io/jest/docs/en/cli.html#watch) files for changes and rerun
  tests related to changed files

```bash
yarn test-watch
```

### Coverage

To see your [code coverage](https://en.wikipedia.org/wiki/Code_coverage) run the
[`yarn test-cover`](../package.json#L122)
command which will:

* recursively find all files ending with `.test.js` in your `src/` directory
* jest executes found files
* generates a coverage report
* opens the coverage report in your browser

```bash
yarn test-cover
```

### Conventions

* test filenames MUST end with `test.js` or `yarn test` will not be able to detect them
* test filenames SHOULD be named after the related component (e.g. create `Link.test.js` for
  `Link.js` component)

### Basic example

To help you on your way RSK comes with the following
[basic test case](../src/components/Layout/Layout.test.js)
you can use as a starting point:

```js
import React from 'react';
import configureStore from 'redux-mock-store';
import { mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import thunk from 'redux-thunk';

import App from '../../App';
import Layout from './Layout';

const middlewares = [thunk];
const mockStore = configureStore(middlewares);
const initialState = {};

describe('<Layout />', () => {
  test('renders children correctly', () => {
    const store = mockStore(initialState);
    const wrapper = mount(
      <App
        context={{
          pathname: '',
          baseUrl: '',
          insertCss: () => {},
          fetch: () => {},
          store,
        }}
      >
        <Layout>
          <div className="child" />
        </Layout>
      </App>,
    );

    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
```
