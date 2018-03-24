import { createLogger as reduxLogger } from 'redux-logger';

export default function createLogger() {
  // https://github.com/evgenyrodionov/redux-logger#options
  return reduxLogger({
    collapsed: true,
  });
}
