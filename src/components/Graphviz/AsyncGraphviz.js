import React from 'react';
import loadable from 'react-loadable';

const LoadingComponent = () => <div>please wait...</div>;
const GraphvizPromise = () =>
  import(/* webpackChunkName: 'graphviz' */ './Graphviz.js');

export default loadable({
  loader: GraphvizPromise,
  loading: LoadingComponent,
});
