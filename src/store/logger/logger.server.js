import { inspect } from 'util';

// Server side redux action logger
export default function createLogger() {
  return store => next => action => { // eslint-disable-line no-unused-vars
    const formattedPayload = inspect(action.payload, {
      colors: true,
    });
    console.log(` * ${action.type}: ${formattedPayload}`); // eslint-disable-line no-console
    return next(action);
  };
}
