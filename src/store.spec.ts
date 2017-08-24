import 'mocha';
import * as assert from 'assert';
import Store, { Middleware } from './store';

process.env.NODE_ENV = 'test';

describe('store', () => {
  describe('constructor', () => {
    it('creates a new instance', () => {
      const store = new Store(1);
      assert(store);
      assert(store.getState);
      assert(store.dispatch);
      assert(store.subscribe);
      assert(store.addMiddleware);
    });
  });

  describe('getState', () => {
    it('returns the state', () => {
      const store = new Store(1);
      assert.strictEqual(store.getState(), 1);
    });
  });

  describe('dispatch', () => {
    it('throws if its argument is not a function', () => {
      const store = new Store(1);
      assert.throws(() => store.dispatch(undefined));
    });

    it('reduces the state', () => {
      const store = new Store(1);
      assert.strictEqual(store.getState(), 1);
      store.dispatch(state => state + 1);
      assert.strictEqual(store.getState(), 2);
    });

    it('returns the new state', () => {
      const store = new Store(1);
      const reducer = state => state + 1;
      assert.strictEqual(store.dispatch(reducer), 2);
    });
  });

  describe('subscribe', () => {
    it('throws if its argument is not a function', () => {
      const store = new Store(1);
      assert.throws(() => store.subscribe(undefined));
    });

    it('returns an unsubscribe function', () => {
      const store = new Store(1);
      const unsubscribe = store.subscribe(() => {});
      assert.strictEqual(typeof unsubscribe, 'function');
    });

    it('performs a subscribtion', done => {
      const store = new Store(1);
      store.subscribe(() => {
        done();
      });
      store.dispatch(state => state + 1);
    });

    it('subscribtion reads the new state', done => {
      const store = new Store(1);
      store.subscribe(() => {
        assert.strictEqual(store.getState(), 2);
        done();
      });
      store.dispatch(state => state + 1);
    });

    it('unsubscribe from change', done => {
      const store = new Store(1);
      const unsubscribe = store.subscribe(() => {
        done(new Error('Unsuccessful subscribtion'));
      });
      unsubscribe();
      store.dispatch(state => state + 1);
      done();
    });
  });

  describe('addMiddleware', () => {
    const trivialReducer = s => s;
    const trivialMiddleware: Middleware = s => n => r => n(r);

    it('returns the enhanced store', () => {
      const store = new Store(1);
      assert.strictEqual(store, store.addMiddleware(trivialMiddleware));
    });

    it('throws if any kind of arguments are not functions', () => {
      assert.throws(() => new Store(1).addMiddleware(trivialMiddleware, undefined));
    });

    describe('middleware', () => {
      it('takes the store instance', () => {
        const store = new Store(1);
        store.addMiddleware(s => {
          assert.strictEqual(s, store);
          return next => reducer => next(reducer);
        });
      });

      it('in the first place takes the original dispatch method as next function', () => {
        const store = new Store(1);
        store.addMiddleware(s => next => {
          assert.strictEqual(next, store.dispatch);
          return reducer => next(reducer);
        });
      });

      it('takes the previous next function and reducer', () => {
        const payload: any = {};
        const store = new Store(1)
          .addMiddleware(s => next => reducer => {
            assert.strictEqual(reducer, payload);
          })
          .addMiddleware(s => next => reducer => next(payload))
          .dispatch(trivialReducer);
      });

      it('can stop the middleware chain', () => {
        const store = new Store(1);
        store.subscribe(() => {
          throw new Error("original dispatch shouldn't run");
        });
        store.addMiddleware(s => n => r => {});
        store.dispatch(trivialReducer);
      });
    });
  });
});
