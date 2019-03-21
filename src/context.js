// @flow

import { createContext } from 'react';

export type AppContextTypes = {|
  pathname: string,
  query: Object,
|};

const AppContext = createContext<AppContextTypes>({
  pathname: '',
  query: {},
});

export default AppContext;
