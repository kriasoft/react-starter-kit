## React Style Guide

### Core Principles

- Place each component in a separate folder
- Avoid having shared resources between components (CSS, images etc.)
- Avoid deeply nested folder structures
- Prefer using class selectors in CSS (see [BEM](https://bem.info/))
- Avoid nested CSS selectors (see [BEM](https://bem.info/))
- Keep CSS simple and declarative, avoid loops, mixins etc.

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

##### CSS styling example:

```jsx
// JSX
<nav className={cx(s.root, this.props.className)}>
  <ul className={s.items}>
    <li className={cx(s.item, s.selected)}>
      <a className={s.link} href="/products">Products</a>
    </li>
    <li className={s.item}>
      <a className={s.link} href="/services">Services</a>
    </li>
  </ul>
</nav>
```

```scss
// CSS
@import '../variables.scss';

.root {
  width: 300px;
}

.items {
  margin: 0;
  padding: 0;
  list-style-type: none;
  text-align: center;
}

.item {
  display: inline-block;
  vertical-align: top;
}

.link {
  display: block;
  padding: 0 25px;
  outline: 0;
  border: 0;
  color: $default-color;
  text-decoration: none;
  line-height: 25px;
  transition: background-color .3s ease;

  &,
  .items:hover & {
    background: $default-bg-color;
  }

  .selected,
  .items:hover &:hover {
    background: $active-bg-color;
  }
}
```

### React Components

- Use [Babel](https://babeljs.io/docs/learn-es6/) transpiler for your source code
- Use [ES6 classes](https://facebook.github.io/react/blog/2015/01/27/react-v0.13.0-beta-1.html#es6-classes) for creating new React components
- Use higher-order components to extend the functionality of existing components

##### React component example:

```js
import React, { Component, PropTypes } from 'react';
import cx from 'classnames';
import s from './SampleComponent.css';
import withStyles from '../../decorators/withStyles';

@withStyles(s)
class SampleComponent extends Component {

  static propTypes = { ... };

  static defaultProps = { ... };

  state = { ... };

  constructor() {
    super();
    // componentWillMount handler
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

  handleClick = (event) => { ... };

  render() {
    return (
      <div className={cx(s.root, this.props.className)} onClick={this.handleClick}>
        ...
      </div>
    );
  }

}

export default SampleComponent;
```

Put custom methods and properties between React API methods and the `render()` method at the bottom.

##### Higher-order React component example:

```js
// withViewport.js
import React, { Component } from 'react';
import { canUseDOM } from 'fbjs/lib/ExecutionEnvironment';

function withViewport(ComposedComponent) {
  return class WithViewport extends Component {

    state = {
      viewport: canUseDOM ?
        {width: window.innerWidth, height: window.innerHeight} :
        {width: 1366, height: 768} // Default size for server-side rendering
    };

    componentDidMount() {
      window.addEventListener('resize', this.handleResize);
      window.addEventListener('orientationchange', this.handleResize);
    }

    componentWillUnmount() {
      window.removeEventListener('resize', this.handleResize);
      window.removeEventListener('orientationchange', this.handleResize);
    }

    handleResize = () => {
      let viewport = {width: window.innerWidth, height: window.innerHeight};
      if (this.state.viewport.width !== viewport.width ||
        this.state.viewport.height !== viewport.height) {
        this.setState({ viewport });
      }
    };

    render() {
      return <ComposedComponent {...this.props} viewport={this.state.viewport}/>;
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
    return <div>{`Viewport: ${width}x${height}`}</div>;
  }
}

export default MyComponent;
```
