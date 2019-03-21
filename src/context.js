// @flow

import { createContext } from 'react';

const AppContext = createContext<{|
  pathname: string,
  query: Object,
|}>({
  pathname: '',
  query: {},
});

export default AppContext;
