import { inspect } from 'util';

// Server side redux action logger
export default function createLogger() {
  // eslint-disable-next-line no-unused-vars
  return store => next => (action) => {
    const formattedPayload = inspect(action.payload, {
      colors: true,
    });
    console.log(` * ${action.type}: ${formattedPayload}`); // eslint-disable-line no-console
    return next(action);
  };
}
