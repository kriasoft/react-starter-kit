/**
 * Created by stupid on 17-4-5.
 */
/* eslint-env mocha */
import { expect } from 'chai';
import sinon from 'sinon';
import createRootReducer from './index';

describe('[createRootReducer] reducers/index.js', () => {
  it('should return a reducer but not a state', () => {
    const apolloClient = { reducer: sinon.spy() };
    const extraErrorPrompt = 'If this is not a creator any more, plz check configureStore\'s hot reloader';
    const rootReducer = createRootReducer({ apolloClient });
    expect(typeof rootReducer).to.equal('function', extraErrorPrompt);
    expect(typeof rootReducer({}, {})).to.equal('object', extraErrorPrompt);
  });
});
