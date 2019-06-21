import { createContext } from 'react';

export type AppContextTypes = {
  pathname: string;
  query?: Object;
  params?: Object;
};

const AppContext = createContext<AppContextTypes>({
  pathname: '',
  query: {},
  params: {},
});

export default AppContext;
