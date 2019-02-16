import React from 'react';
import loadable from 'react-loadable';

const LoadingComponent = () => <div>please wait...</div>;
const D3Promise = () => import(/* webpackChunkName: 'graphviz' */ './D3.js');

export default loadable({
  loader: D3Promise,
  loading: LoadingComponent,
});
