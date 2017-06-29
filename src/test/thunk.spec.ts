import 'mocha';
import * as assert from 'assert';
import Store, { thunk, Thunk, Reducer } from '../store';

process.env.NODE_ENV = 'test';

describe('thunk', () => {
  it('as Store static member', () => {
    assert.strictEqual(Store.thunk, thunk);
  });

  it('dispatch invokes the delegate', () => {
    const store = new Store(1).addMiddleware<Thunk<number, void, any>>(thunk);
    assert.strictEqual(store.getState(), 1);
    store.dispatch(
      ((state) => (dispatch, getState) => {
        store.dispatch((state) => getState() + 1);
      }) as Thunk<number, void, void>
    );
    assert.strictEqual(store.getState(), 2);
  });

  it('dispatch returns the delegate', () => {
    const store = new Store(1).addMiddleware<Thunk<number, void, any>>(thunk);
    const expected = 8;
    assert.strictEqual(
      store.dispatch((state) => (dispatch) => {
        store.dispatch((state) => state + 1);
        return expected;
      }),
      expected
    );
  });

  it('extra arguments are provided', () => {
    const add = (a, b) => a + b;
    const store = new Store(1).addMiddleware<Thunk<number, typeof add, any>>(
      thunk.withExtraArgument(add)
    );
    store.dispatch((state) => (dispatch, getState, add) => {
      store.dispatch((state) => add(state, 1));
    });
    assert.strictEqual(store.getState(), 2);
  });
});
