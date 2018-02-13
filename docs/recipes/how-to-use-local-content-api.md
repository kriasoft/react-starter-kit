## How to Use the local content API

With the local content API you can fetch files based on for example the route.
The API will automatically try to fetch one of the following file types:

* .md ([Markdown](http://commonmark.org/help/))
* .json (Javascript Object)
* .html (Plain HTML)

The files are located in the `content/pages` folder in the root of the project.
Then it will follow the path defined including sub-folders.

You need to post the "path" in the body of an fetch just like the example below,
or you can find it in the `src/routes/generic/index.js`.
In the generic route there is a example on how to load a markdown file using the LocalAPI
and then putting it in the DefaultPage component

```js
const resp = await fetch(`/localapi/content`, {
  method: `post`,
  headers: {
    Accept: `application/json`,
    'Content-Type': `application/json`,
  },
  body: JSON.stringify({
    path: `${path}`,
  }),
});
```
