## Integrating [Redux](http://redux.js.org/index.html)

Merge `feature/redux` branch with git.
If you are interested in `feature/react-intl`,
merge that branch instead as it also includes Redux.

**If you don't know redux well, you should [read about it first](http://redux.js.org/docs/basics/index.html).**


## Creating Actions

 1. Go to `src/constants/index.js` and define action name there.

 2. Go to `src/actions/` and create file with appropriate name.
    You can copy `src/actions/runtime.js` as a template.

 3. If you need async actions, use [`redux-thunk`](https://github.com/gaearon/redux-thunk#readme).
    For inspiration on how to create async actions you can look at
    [`setLocale`](https://github.com/kriasoft/react-starter-kit/blob/feature/react-intl/src/actions/intl.js)
    action from `feature/react-intl`.
    See [Async Flow](http://redux.js.org/docs/advanced/AsyncFlow.html) for more information on this topic.


## Creating Reducer (aka Store)

 1. Go to [`src/reducers/`](https://github.com/kriasoft/react-starter-kit/tree/feature/redux/src/reducers) and create new file there.

    You can copy [`src/reducers/runtime.js`](https://github.com/kriasoft/react-starter-kit/tree/feature/redux/src/reducers/runtime.js) as a template.

    - Do not forget to always return `state`.
    - Never mutate provided `state`.
      If you mutate state, rendering of connected component will not be triggered because of `===` equality.
      Always return new value if you perform state update.
      You can use this construct: `{ ...state, updatedKey: action.payload.value, }`
    - Keep in mind that store state *must* be repeatable by replaying actions on it.
      For example, when you store timestamp, pass it into *action payload*.
      If you call REST API, do it in action. *Never do this in reducer!*

 2. Edit [`src/reducers/index.js`](https://github.com/kriasoft/react-starter-kit/tree/feature/redux/src/reducers/index.js), import your reducer and add it to root reducer created by
 [`combineReducers`](http://redux.js.org/docs/api/combineReducers.html)


## Connecting Components

You can use [`connect()`](https://github.com/reactjs/react-redux/blob/master/docs/api.md#connectmapstatetoprops-mapdispatchtoprops-mergeprops-options) High-Order Component from [`react-redux`](https://github.com/reactjs/react-redux#readme) package.

See [Usage With React](http://redux.js.org/docs/basics/UsageWithReact.html) on redux.js.org.

For an example you can look at
[`<LanguageSwitcher>`](https://github.com/kriasoft/react-starter-kit/blob/feature/react-intl/src/components/LanguageSwitcher/LanguageSwitcher.js)
component from `feature/react-intl` branch. It demonstrates both subscribing to store and dispatching actions.


## Dispatching Actions On Server

See source of `src/server.js`
