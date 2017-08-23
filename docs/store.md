# Store

The `Store` holds the whole state tree of your application. You need to instantiate it.

## **`constructor(initialState: State)`**

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

### **`getState(): State`**

This method returns the current state of the store.

#### Returns

(*any*): The current state of the store.

#### Example

```javascript
const store = new Store({ counter: 0 })

const state = store.getState()

console.log(state.counter === 0) // true
```

### **`dispatch(reducer: Reducer): State`**

Dispatches a reducer.

#### Arguments

1) **reducer** (*Reducer: State -> State*): That reducer will reduce the state of the store. This takes the current state and returns the next state.

#### Returns

(*State*): The new state after reducing.

#### Example

```javascript
const store = new Store({ counter: 0 })

const increment = state => ({ counter: state.counter + 1 })

const result = store.dispatch(increment)

console.log(result === increment) // true
```

#### Notes

If you use middlewares, that is not guaranteed that the `dispatch` returns the new state. For example `thunk` middleware modify `dispatch` that it returns the result of delegate function.

### **`subscribe(listener: Listener): Unsubscribe`**

Adds a state change listener.

#### Arguments

1) **listener** (*Listener: void -> void*): The listener that will be synchronously run after the state was modified by dispatching a reducer.

#### Returns

(*Unsubscribe: void -> void*): The unsubscribe function, that you can use to unsubscribe the given listener.

#### Example

```javascript
const store = new Store({ counter: 0 })

const increment = state => ({ counter: state.counter + 1 })

const unsubscribe = store.subscribe(() => console.log(store.getState()))

store.dispatch(increment) // listener logs the new state

unsubscribe()

store.dispatch(increment) // listener won't be fired
```

### **`addMiddleware(...middlewares: Middleware[]): Store`**

Enhances the store with the given middleware(s).

Middlewares will be run at dispatching before the store applies the new state of the reducer. The added middlewares are composed by order of addition, so the last added middleware will run first.

#### Arguments

1) **...middlewares** (*Middleware: Store -> Next -> Reducer -> any*): Middlewares as variadic arguments. Middleware functions take the `store` instance, a `next` function and the previous `reducer`. The middleware can provide a new reducer via the `next` function.

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