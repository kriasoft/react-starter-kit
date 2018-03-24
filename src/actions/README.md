# Redux Actions and Action Creators

### Action Types

Should go to `src/constants/…`

```js
export const ADD_TODO = 'ADD_TODO';
```

### Action Creators

Should go to `src/actions/…`

```js
export function addTodo({ text }) {
  return {
    type: ADD_TODO,
    payload: {
      text,
      // ...
    },
  };
}
```

## Flux Standard Action

An action _MUST_

* be a plain JavaScript object.
* have a `type` property. (_string_)

An action _MAY_

* have an `error` property. (`true` → `payload` _should be instance of `Error`_)
  If `error` has any other value besides `true`, the action _MUST NOT_ be interpreted as an error.
* have a `payload` property. (_any, object is reccomended_)
* have a `meta` property. (_any_)
  It is intended for any extra information that is not part of the payload

An action _MUST NOT_ include properties other than `type`, `payload`, `error`, and `meta`.

[**Read more about FSA**](https://github.com/redux-utilities/flux-standard-action#flux-standard-action)

### Examples

```js
// Action example:
{
  type: ADD_TODO,
  payload: {
    text: 'Contribute to React Starter Kit.',
  },
}
// Error action example:
{
  type: 'ADD_TODO',
  error: true,
  payload: new Error('Database Error'),
}
```

# Other Resources

* [Actions on redux.js.org](https://redux.js.org/basics/actions)
* [Flux Standard Action](https://github.com/redux-utilities/flux-standard-action#flux-standard-action)
