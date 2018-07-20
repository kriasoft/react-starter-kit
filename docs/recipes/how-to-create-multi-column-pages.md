## How to Create Multi-column Pages

This feature uses [CSS Grid Layout Module Level 1](https://www.w3.org/TR/css-grid-1/)
to lay out the page into two or three columns

### Adding Multiple Columns

1.  Merge `feature/multi-column-layout` branch with git.

2.  Run `yarn install` (the only dependency added is [lodash-inflection](https://www.npmjs.com/package/lodash-inflection) for the `titleize` function)

3.  [See the About Us Page](../../src/routes/about/index.js) for an example of using the default behavior,
    which is to have columns to the left and right of the main page content, which [uses the global column content](../../src/routes/global-columns)
    meant to be used across multiple pages as the default content for multi-column pages.

#### Customizing Column Layout and Content

Put the following in the **index.js** file of your custom page directory [under the routes directory](../../src/routes)\:

```js
import React from 'react';
import Layout from '../../components/Layout';
import Page from '../../components/Page';
import yourPage from './yourPage.md';
import withColumns, { defaultColumnData } from '../../../tools/lib/columns';

// A page with only a left column having custom content
// Change 'left-column' to 'right-column' if you want only a right column
// Create file left-column.md in your page directory under the routes directory
//
// You can also provide custom content for both columns by adding both keys
// below and creating the corresponding files
function action() {
  withColumns(yourPage, {
    leftColumnKey: 'left-column',
    columnsKey: 'name-of-your-page-directory-under-routes',
  });
  return {
    chunks: [yourPage.key],
    component: (
      <Layout>
        <Page {...yourPage} />
      </Layout>
    ),
  };
}

export default action;
```
