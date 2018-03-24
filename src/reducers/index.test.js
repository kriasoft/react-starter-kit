/* eslint-env jest */
import rootReducer from './index';

describe('[rootReducer] reducers/index.js', () => {
  it('should return a state', () => {
    const extraErrorPrompt =
      "If this is not a creator any more, plz check configureStore's hot reloader";
    expect(typeof rootReducer).toBe('function', extraErrorPrompt);
    expect(typeof rootReducer({}, {})).toBe('object', extraErrorPrompt);
  });
});
