# Store

The `Store` holds the whole state tree of your application. You need to instantiate it.

## Constructor

#### Arguments

1) **initialState** (*any*): The initial state of your application. Usually it is an object that represents the state tree.

#### Returns

(*Store*): The new `Store` instance.

#### Example

```javascript
import Store from 'repatch'

const store = new Store({ counter: 0 })
```

## Methods

### `getState()`

This method returns the current state of the store.

#### Returns

(*any*): The current state of the store.

#### Example

```javascript
const store = new Store({ counter: 0 })

const state = store.getState()

console.log(state.counter === 0) // true
```

### `dispatch(reducer)`

Dispatches a reducer.

#### Arguments

1) **reducer** (*ReducerFunction: State -> State*): That reducer will reduce the state of the store. This takes the current state and returns the next state.

#### Returns

(*ReducerFunction*): The final reducer that is made by applying the middlewares - if they are given. If the store does enhanced with middlewares, the `dispatch` method returns the same reducer that was taken as argument.

#### Example

```javascript
const store = new Store({ counter: 0 })

const increment = state => ({ counter: state.counter + 1 })

const result = store.dispatch(increment)

console.log(result === increment) // true
```

#### Notes

Middlewares can modify the given reducer, so that is not guaranteed that the `dispatch` returns the original reducer that was taken as argument.

### `subscribe(listener)`

Adds a state change listener.

#### Arguments

1) **listener** (*ListenerFunction: void -> void*): The listener that will be synchronously run after the state was modified by dispatching a reducer.

#### Returns

(*UnsubscribeFunction: void -> void*): The unsubscribe function, that you can use to unsubscribe the given listener.

#### Example

```javascript
const store = new Store({ counter: 0 })

const increment = state => ({ counter: state.counter + 1 })

const unsubscribe = store.subscribe(() => console.log(store.getState()))

store.dispatch(increment) // listener logs the new state

unsubscribe()

store.dispatch(increment) // listener won't be fired
```

### `addMiddleware(...middlewares)`

Enhances the store with the given middleware(s).

Middlewares will be run at dispatching before the store applies the new state of the reducer. The added middlewares are composed by order of addition, so the last added middleware will run first.

#### Arguments

1) **...middlewares** (*MiddlewareFunction: Store -> Next -> Reducer -> any*): Middlewares as variadic arguments. Middleware functions take the `store` instance, a `next` function and the previous `reducer`. The middleware can provide a new reducer via the `next` function.

#### Returns

(*Store: this*): Returns the enhanced `Store` instance for chaining.

#### Example

```javascript
const logger = store => next => reducer => {
  const state = store.getState()
  const nextState = reducer(state)
  console.log(state, nextState)
  return next(_ => nextState)
}

const store = new Store({ counter: 0 }).addMiddleware(logger)

store.dispatch(state => ({ counter: state.counter + 1 }))
// logger logs { counter: 0 } { counter: 1 }
```

## Static members

### `thunk`

The [thunk](thunk.md) middleware.