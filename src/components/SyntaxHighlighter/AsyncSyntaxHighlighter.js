import React from 'react';
import loadable from 'react-loadable';

const LoadingComponent = () => <div>please wait...</div>;
const SyntaxHighlighterPromise = () =>
  import(/* webpackChunkName: 'hljs' */ './SyntaxHighlighter.js');

export default loadable({
  loader: SyntaxHighlighterPromise,
  loading: LoadingComponent,
});
