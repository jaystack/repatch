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

1) **reducer** (*ReducerFunction: State -> State*): That reducer will reduce the state of the store. This takes the current state and returns the next state. The reducer will be run synchronously after applying the middlewares - if they are given.

#### Returns

(*ReducerFunction*): The final reducer that is made by applying the middlewares - if they are given. If the store does not have middlewares, the `dispatch` method returns the same reducer that was taken as argument.

#### Example

```javascript
const store = new Store({ counter: 0 })

const increment = state => ({ counter: state.counter + 1 })

const result = store.dispatch(increment)

console.log(result === increment) // true
```

#### Notes

1) Middlewares can modify the given reducer, so that is not guaranteed that the `dispatch` returns the original reducer that was taken as argument.
2) The `dispatch` only runs the reducer, when the final reducer (after applying middlewares) is still a function. If the final reducer is a function, then the dispatch modifies the state by its returned value. This behaviour is strongly used by the [thunk](thunk.md) middleware, that returns the returned value of the delegate.

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

Adds middleware(s) to the store.

Middlewares will be run at dispatching before the store applies the new state of the reducer. The added middlewares are composed by order of addition.

#### Arguments

1) **...middlewares** (*MiddlewareFunction: (Store, Reducer) -> Reducer*): Middlewares as variadic arguments. Middleware functions take the `Store` instance and the dispatched reducer and return a new reducer.

#### Returns

(*Store: this*): Returns the same `Store` instance for chaining.

#### Example

```javascript
const store = new Store({ counter: 0 })

const logger = (store, reducer) => {
  const nextState = reducer(store.getState())
  console.log(nextState)
  return _ => nextState
}

store.addMiddleware(logger)

store.dispatch(state => ({ counter: state.counter + 1 }))
// logger logs { counter: 1 }
```

## Static members

### `thunk`

The [thunk](thunk.md) middleware.