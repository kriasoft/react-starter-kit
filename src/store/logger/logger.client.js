import { createLogger as reduxLogger } from 'redux-logger';

export default function createLogger() {
  return reduxLogger({
    collapsed: true,
  });
}
