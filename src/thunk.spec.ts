import 'mocha';
import * as assert from 'assert';
import Store, { thunk } from './store';

process.env.NODE_ENV = 'test';

describe('thunk', () => {
  describe('dispatch', () => {
    it('invokes the delegate', () => {
      const store = new Store(1).addMiddleware(thunk);
      assert.strictEqual(store.getState(), 1);
      store.dispatch(state => (dispatch, getState) => {
        dispatch(state => getState() + 1);
      });
      assert.strictEqual(store.getState(), 2);
    });

    it('returns the result of delegate', () => {
      const store = new Store(1).addMiddleware(thunk);
      const expected = 8;
      assert.strictEqual(
        store.dispatch(state => dispatch => {
          dispatch(state => state + 1);
          return expected;
        }),
        expected
      );
    });
  });

  it('provides extra arguments', () => {
    const add = (a, b) => a + b;
    const store = new Store(1).addMiddleware(thunk.withExtraArgument(add));
    store.dispatch(state => (dispatch, getState, add) => {
      dispatch(state => add(state, 1));
    });
    assert.strictEqual(store.getState(), 2);
  });
});
