import React from 'react';
import loadable from 'react-loadable';

const LoadingComponent = () => <h3>please wait...</h3>;
const TextEditorPromise = () =>
  import(/* webpackChunkName: 'texteditor' */ './TextEditor.js');

export default loadable({
  loader: TextEditorPromise,
  loading: LoadingComponent,
});
