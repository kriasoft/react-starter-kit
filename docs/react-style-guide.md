## React Style Guide

### Folder Structure

- Place each component in a separate folder
- Avoid having shared resources between components (css, images etc.)
- Keep all components' folders in the same parent folder (avoid nesting)

##### File structure per component example:

```
/src/components/Navigation/icon.svg
/src/components/Navigation/Navigation.css
/src/components/Navigation/Navigation.js
/src/components/Navigation/Navigation.test.js
/src/components/Navigation/Navigation.ru-RU.css
/src/components/Navigation/package.json
```

For more information google for [component-based UI development](https://google.com/search?q=component-based+ui+development).

### CSS Class Names

Use [BEM](https://bem.info/) approach for naming CSS classes. See also [SUIT CSS](https://suitcss.github.io/) for inspiration.

```less
// CSS
.ComponentName { }
.ComponentName--modifier { }
.ComponentName-elementName { }
.ComponentName-elementName--modifier { }
```

##### CSS styling example:

```jsx
// JSX
<nav className="Navigation">
  <ul className="Navigation-items">
    <li className="Navigation-item Navigation-item--selected">
      <a className="Navigation-link" href="/products">Products</a>
    </li>
    <li className="Navigation-item">
      <a className="Navigation-link" href="/services">Services</a>
    </li>
  </ul>
</nav>
```

```less
// CSS
@import '../variables.css';

.Navigation {
  &-items {
    margin: 0;
    padding: 0;
    list-style-type: none;
    text-align: center;
  }

  &-item {
    display: inline-block;
    vertical-align: top;
  }

  &-link {
    display: block;
    padding: 0 25px;
    outline: 0;
    border: 0;
    color: @default-color;
    text-decoration: none;
    line-height: 25px;
    transition: background-color .3s ease;

    &,
    .Navigation-items:hover & {
      background: var(--default-bg-color);
    }

    &--selected,
    .Navigation-items:hover &:hover {
      background: var(--active-bg-color);
    }
  }
}
```

### React Components

- Use [Babel](https://babeljs.io/docs/learn-es6/) transpiler for your source code
- Use [ES6 classes](https://facebook.github.io/react/blog/2015/01/27/react-v0.13.0-beta-1.html#es6-classes) for creating new React components
- Use higher-order components to extend the functionality of existing components

##### React component example:

```js
import './SampleComponent.css';
import React, { Component } from 'react';

class SampleComponent extends Component {

  static propTypes = { ... };

  static defaultProps = { ... };
  
  constructor() {
    super();
    this.state = { ... };
  }

  componentDidMount() {
    // ...
  }

  componentWillUnmount() {
    // ...
  }

  shouldComponentUpdate() {
    // ...
  }

  render() {
    return (
      <div className="SampleComponent">
      </div>
    );
  }

}

export default SampleComponent;
```

Put custom methods and properties at the bottom of the file, after the render() method.

##### Higher-order React component example:

```js
// withViewport.js
import React, { Component } from 'react';
import { canUseDOM } from 'react/lib/ExecutionEnvironment';

function withViewport(ComposedComponent) {
  return class WithViewport extends Component {

    constructor() {
      super();

      this.state = {
        viewport: canUseDOM ?
          {width: window.innerWidth, height: window.innerHeight} :
          {width: 1366, height: 768} // Default size for server-side rendering
      };
      this.handleResize = this.handleResize.bind(this);
    }

    componentDidMount() {
      window.addEventListener('resize', this.handleResize);
      window.addEventListener('orientationchange', this.handleResize);
    }

    componentWillUnmount() {
      window.removeEventListener('resize', this.handleResize);
      window.removeEventListener('orientationchange', this.handleResize);
    }

    render() {
      return <ComposedComponent {...this.props} viewport={this.state.viewport}/>;
    }

    handleResize() {
      let viewport = {width: window.innerWidth, height: window.innerHeight};
      if (this.state.viewport.width !== viewport.width ||
        this.state.viewport.height !== viewport.height) {
        this.setState({viewport: viewport});
      }
    }

  };
};

export default withViewport;
```

```js
// MyComponent.js
import React from 'react';
import withViewport from './withViewport';

@withViewport
class MyComponent {
  render() {
    let { width, height } = this.props.viewport;
    return <div>{'Viewport: ' + width + 'x' + height}</div>;
  }
}

export default MyComponent;
```
