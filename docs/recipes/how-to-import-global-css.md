## How to Import Global CSS

```css
/* foo.global.css */
@import 'bar/baz.css';
```

```css
/* foo.css */

/* Your local classes */
```

```js
// foo.js
import globalStyles from './foo.global.css';
import localStlyes from './foo.css';

...

export default withStyles(globalStyles, localStlyes)(Foo);
```
