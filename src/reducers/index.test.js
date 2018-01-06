/* eslint-env jest */
import createRootReducer from './index';

describe('[createRootReducer] reducers/index.js', () => {
  it('should return a reducer but not a state', () => {
    const extraErrorPrompt =
      "If this is not a creator any more, plz check configureStore's hot reloader";
    const rootReducer = createRootReducer();
    expect(typeof rootReducer).toBe('function', extraErrorPrompt);
    expect(typeof rootReducer({}, {})).toBe('object', extraErrorPrompt);
  });
});
