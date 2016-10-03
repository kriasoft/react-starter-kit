## How to Integrate [Disqus](https://disqus.com)

https://disqus.com/admin/create/

#### `DisqusThread.js`

```js
import React, { PropTypes } from 'react';

const SHORTNAME = 'example';
const WEBSITE_URL = 'http://www.example.com';

function renderDisqus() {
  if (window.DISQUS === undefined) {
    var script = document.createElement('script');
    script.async = true;
    script.src = 'https://' + SHORTNAME + '.disqus.com/embed.js';
    document.getElementsByTagName('head')[0].appendChild(script);
  } else {
    window.DISQUS.reset({reload: true});
  }
}

class DisqusThread extends React.Component{

  static propTypes = {
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    path: PropTypes.string.isRequired
  };

  shouldComponentUpdate(nextProps) {
    return this.props.id !== nextProps.id ||
      this.props.title !== nextProps.title ||
      this.props.path !== nextProps.path;
  }

  componentDidMount() {
    renderDisqus();
  }

  componentDidUpdate() {
    renderDisqus();
  }

  render() {
    let { id, title, path, ...other} = this.props;

    if (process.env.BROWSER) {
      window.disqus_shortname = SHORTNAME;
      window.disqus_identifier = id;
      window.disqus_title = title;
      window.disqus_url = WEBSITE_URL + path;
    }

    return <div {...other} id="disqus_thread" />;
  }

}

export default DisqusThread;
```

#### `MyComponent.js`

```js
import React from 'react';
import DisqusThread from './DisqusThread.js';

class MyComponent extends React.Component{

  render() {
    return (
      <div>
        <DisqusThread id="e94d73ff-fd92-467d-b643-c86889f4b8be"
                      title="How to integrate Disqus into ReactJS App"
                      path="/blog/123-disquss-integration" />
      </div>
    );
  }

}

export default MyComponent;
```
