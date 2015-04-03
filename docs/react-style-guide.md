## React Style Guide

### Folder Structure

- Place each component in a separate folder
- Avoid having shared resources between components (css, images etc.)
- Keep all components' folders in the same parent folder (avoid nesting)

A sample file structure per component:

```
/src/components/Navigation/Navigation.js
/src/components/Navigation/Navigation-test.js
/src/components/Navigation/Navigation.less
/src/components/Navigation/Navigation.ru-RU.less
/src/components/Navigation/icon.svg
/src/components/Navigation/package.json
```

For more information google for [component-based UI development](https://google.com/search?q=component-based+ui+development).

### CSS Class Names

Use [BEM](https://bem.info/) approach for naming CSS classes.

```css
.ComponentName { }
.ComponentName--modifier { }
.ComponentName-elementName { }
.ComponentName-elementName--modifier { }
```

See [SUIT CSS](https://suitcss.github.io/) for inspiration.

### React Components

- Use [Babel](https://babeljs.io/docs/learn-es6/) transpiler for your source code
- Use [ES6 classes](https://facebook.github.io/react/blog/2015/01/27/react-v0.13.0-beta-1.html#es6-classes) for creating new React components
- Use higher-order components to extend the functionality of existing components

A sample component class:

```js
'use strict';

import './SampleComponent.less';
import { Component } from 'react';

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

A sample higher-order component:

```js
'use strict';

import React, { Component } from 'react';
import { canUseDOM } from 'react/lib/ExecutionEnvironment';

function setViewport(ComposedComponent) {
  return class Viewport extends Component {

    constructor() {
      super();

      this.state = {
        viewport: canUseDOM ?
          {width: window.innerWidth, height: window.innerHeight} :
          {width: 1366, height: 768} // Default size for server-side rendering
      };

      this.handleResize = () => {
        let viewport = {width: window.innerWidth, height: window.innerHeight};
        if (this.state.viewport.width !== viewport.width ||
          this.state.viewport.height !== viewport.height) {
          this.setState({viewport: viewport});
        }
      };
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

  };
};

export default setViewport;
```
