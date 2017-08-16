# Thunk middleware

Thunk is a repatch middleware to handle async actions. It is very similar to [redux-thunk](https://www.npmjs.com/package/redux-thunk). Thunk middleware allows you to create reducers that returns a function (delegate). The delegate will be fired at dispatching.

## ThunkMiddleware

`State -> Delegate`

#### Example

```javascript
import Store, { thunk } from 'repatch'

const store = new Store({ items: [] }).addMiddleware(thunk)

store.dispatch(_ => async (dispatch, getState) => {
  const items = await fetch('/items')
  dispatch(state => ({ ...state, items }))
})
```

## Extra arguments

#### Example

```javascript
import Store, { thunk } from 'repatch'
import api from './api'

const store = new Store({ items: [] })
  .addMiddleware(thunk.withExtraArgument(api))

store.dispatch(_ => async (dispatch, getState, api) => {
  const items = await api.get('/items')
  dispatch(state => ({ ...state, items }))
})
```

## Delegate

#### Arguments

1) **dispatch** (*Store.dispatch*): The `dispatch` method of the `Store` instance. With this you can dispatch any reducer to the store.

2) **getState** (*Store.getState*): The `getState` method of the `Store` instance. With this you can get the current state of the store.

3) **extraArgument** (*any*): An extra argument that you can provide at adding the thunk middleware. The `extraArgument` could be anything what you want. It is useful to keep the delegates side-effect-less.

#### Returns

(*any*): Delegate can return anything. If your delegate returns a `Promise`, you can chain your async actions to each other.