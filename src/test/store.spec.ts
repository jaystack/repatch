import 'mocha'
import * as assert from 'assert'
import Store from '../store'

process.env.NODE_ENV = 'test'

describe('store', () => {
  describe('instantiation', () => {
    it('Store instantiation', () => {
      const store = new Store(1)
      assert(store)
      assert(store.getState)
      assert(store.dispatch)
      assert(store.subscribe)
    })
  })

  describe('getState', () => {
    it('getState returns the state', () => {
      const store = new Store(1)
      assert.strictEqual(store.getState(), 1)
    })
  })

  describe('dispatch', () => {
    it('dispatch throws if its argument is not a function', () => {
      const store = new Store(1)
      assert.throws(() => store.dispatch(undefined))
    })

    it('dispatch reduces the state', () => {
      const store = new Store(1)
      assert.strictEqual(store.getState(), 1)
      store.dispatch(state => state + 1)
      assert.strictEqual(store.getState(), 2)
    })

    it('dispatch returns the reducer', () => {
      const store = new Store(1)
      const reducer = state => state + 1
      assert.strictEqual(store.dispatch(reducer), reducer)
    })
  })

  describe('subscribe', () => {
    it('subscribe throws if its argument is not a function', () => {
      const store = new Store(1)
      assert.throws(() => store.subscribe(undefined))
    })

    it('subscribe returns a subscriber', () => {
      const store = new Store(1)
      const subscriber = store.subscribe(() => {})
      assert.strictEqual(typeof subscriber, 'function')
    })

    it('subscribe performs a subscribtion', done => {
      const store = new Store(1)
      store.subscribe(() => {
        done()
      })
      store.dispatch(state => state + 1)
    })

    it('subscribtion reads the new state', done => {
      const store = new Store(1)
      store.subscribe(() => {
        assert.strictEqual(store.getState(), 2)
        done()
      })
      store.dispatch(state => state + 1)
    })

    it('unsubscribe', done => {
      const store = new Store(1)
      const unsubscribe = store.subscribe(() => {
        done(new Error('Unsuccessful subscribtion'))
      })
      unsubscribe()
      store.dispatch(state => state + 1)
      done()
    })
  })
})
