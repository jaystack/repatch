# <a href="https://www.npmjs.com/package/repatch"><img alt="Repatch" src="http://services.jaystack.com/repatch-logo.png" height="50px"></a>

## Dispatch reducers

[Redux](https://www.npmjs.com/package/redux) has a verbose action management. The most of redux projects do not need sctrict action administration. Action types, action creators and the reducer's action handlers are mutually assigned to each other. Repatch's purpose is creating actions briefly.

The simplest way to keep immutable action controlled dataflow is dispatching pure functions (as reducers) to the store.

```javascript
store.dispatch(state => ({ ...state, counter: state.counter + 1 }));
```

**In this terminology action is a function that returns a reducer:**

```javascript
const increment = amount => state => ({
  ...state,
  counter: state.counter + amount
});

store.dispatch(increment(42));
```

## Installation

```
npm install repatch
```

## Examples

- [JavaScript example](https://github.com/jaystack/repatch-example-electron-app)
- [TypeScript example](https://github.com/jaystack/repatch-example-electron-app-ts)

## How to use

```javascript
import Store from 'repatch';

const store = new Store(initialState);
```

In CommonJS format you should use:

```javascript
const Store = require('repatch').default;
```

Repatch's interface is the same as Redux, therefore you can use with [react-redux](https://www.npmjs.com/package/react-redux).

```javascript
const unsubscribe = store.subscribe(() => console.log(store.getState()));

store.dispatch(resolveFetchingUsers(users));

unsubscribe();
```

## Sub-reducers

We do not need to reduce always the whole state of the store. Repatch also offers a way to combine sub-reducers, those describe a deeply nested property in the state. We just define a function that takes a nested reducer as argument, and returns a reducer that reduces the whole state:

```javascript
const reduceFoo = fooReducer => state => ({
  ...state,
  bar: {
    ...state.bar,
    foo: fooReducer(state.bar.foo)
  }
});
```

Using that we can define easily an action, that sets an `x` property in the `foo` object:

```javascript
const setX = x => reduceFoo(state => ({ ...state, x }));
```

## Middlewares

A repatch middleware takes the store instance and the previous reducer and returns a new reducer:

```javascript
(Store, Reducer): Reducer
```

Use `addMiddleware` method to chaining middlewares:

```javascript
const store = new Store(initialState)
  .addMiddleware(mw1)
  .addMiddleware(mw2, mw3);
```

## Async actions

The `thunk` middleware is useful for handling async actions similar to [redux-thunk](https://www.npmjs.com/package/redux-thunk).

```javascript
import Store, { thunk } from 'repatch';

const store = new Store(initialState).addMiddleware(thunk);
```

In thunk async actions reducer returns a function (*delegate*):

```javascript
const updateUser = delta => state => async (dispatch, getState) => {
  const editedUserId = getState().editedUser;
  dispatch(toggleSpinner(true));
  await api.updateUser(editedUserId, delta);
  await dispatch(fetchUsers());
  dispatch(toggleSpinner(false));
};
```

It is possible to embed async actions within each other too and awaiting their resolving:

```javascript
await dispatch(fetchUsers());
```

You can access `thunk` as static member of `Store` too: `Store.thunk`

### Injecting extra argument

It is possible to inject extra arguments into async actions:

```javascript
import Store, { thunk } from 'repatch';
import api from './api';
import hashHistory from 'react-router';

const store = new Store(initialState)
  .addMiddleware(thunk.withExtraArgument({ api, hashHistory }));
```

Then you can access these arguments in your delegates:

```javascript
const updateUser = delta => state =>
  async (dispatch, getState, { api, hashHistory }) => {
    // ...
  }
```

This way you can keep your async actions independently from outer instances. This practice is useful for testing.

## Testing

### Sync actions

Sync actions' testing is easy:

```javascript
import * as assert from 'assert';
import { changeName } from './actions';

// ...

it('changeName', () => {
  const state = { name: 'john' };
  const nextState = changeName('jack')(state);
  assert.strictEqual(nextState.name, 'jack');
});
```

### Async actions

For async action tests you need to instantiate the `Store`:

```javascript
import Store, { thunk } from 'repatch';
import * as assert from 'assert';
import { fetchUsers } from './actions';

const mockUsers = [{ username: 'john' }];
const mockApi = {
  getUsers: () => Promise.resolve(mockUsers)
}

// ...

it('fetchUsers', async () => {
  const state = { users: [] };
  const store = new Store(state)
    .addMiddleware(thunk.withExtraArgument(mockApi));
  await store.dispatch(fetchUsers());
  const nextState = store.getState();
  assert.deepEqual(nextState.users, mockUsers);
});
```

---

## License

[MIT](https://spdx.org/licenses/MIT)

## Developed by

[![JayStack logo](http://services.jaystack.com/jaystack_logo_transparent_50.png)](http://jaystack.com/)