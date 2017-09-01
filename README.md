# <a href="https://www.npmjs.com/package/repatch"><img alt="Repatch" src="http://jaystack.com/wp-content/uploads/2017/08/repatch-logo.png" height="50px"></a>

## Dispatch reducers

[Repatch](https://www.npmjs.com/package/repatch) is just a simplified [Redux](https://www.npmjs.com/package/redux), that let you create actions more briefly by dispatching reducers directly.

<img alt="draft" src="http://jaystack.com/wp-content/uploads/2017/08/repatch_pl-hand-d2-e1503663114155.png" width="40%">

```javascript
store.dispatch(state => ({ ...state, counter: state.counter + 1 }));
```

**In this terminology, an action is a function that returns a reducer:**

```javascript
const increment = amount => state => ({
  ...state,
  counter: state.counter + amount
});

store.dispatch(increment(42));
```

## Motivation

[Redux](https://www.npmjs.com/package/redux) has verbose action management. The most of redux projects do not need sctrict action administration. Action types, action creators and the reducer's action handlers are mutually assigned to each other. Repatch's purpose is creating actions briefly.

The simplest way to keep the immutable action controlled dataflow and define actions briefly is dispatching pure functions (as reducers) to the store.

## Comparison with [Redux](https://www.npmjs.com/package/redux)

Repatch is
- **less verbose**
- **3X smaller** (the minified version is __less then 1 KB__)
- [**9X faster**](https://github.com/jaystack/redux-repatch-performance-comparison)

then Redux.

## [API Reference](https://github.com/jaystack/repatch/wiki)

## Examples

- [JavaScript example](https://github.com/jaystack/repatch-example-electron-app)
- [TypeScript example](https://github.com/jaystack/repatch-example-electron-app-ts)

## Articles

[Repatch - the simplified Redux](https://community.risingstack.com/repatch-the-simplified-redux/)

## Installation

```
npm install --save repatch
```

## How to use

### ES6

```javascript
import Store from 'repatch';

const store = new Store(initialState);
```

### CommonJS

```javascript
const Store = require('repatch').Store;
```

### Bundles

```html
<script src="https://unpkg.com/repatch/dist/repatch.js"></script>
```

or the minified bundle:

```html
<script src="https://unpkg.com/repatch/dist/repatch.min.js"></script>
```

and

```javascript
const Store = Repatch.Store;
```

## Compatibility with [react-redux](https://www.npmjs.com/package/react-redux)

Repatch's interface is very similar to Redux, therefore you can use with [react-redux](https://www.npmjs.com/package/react-redux).

```javascript
const unsubscribe = store.subscribe(() => console.log(store.getState()));

store.dispatch(resolveFetchingUsers(users));

unsubscribe();
```

## TODO app in brief

```javascript
const store = new Store([]);

const addTodo = text => todos => [...todos, { text, checked: false }];

const checkTodo = index => todos => todos.map(
  (todo, i) => (i === index ? { ...todo, checked: !todo.checked } : todo)
);

const editTodo = (index, text) => todos => todos.map(
  (todo, i) => (i === index ? { ...todo, text } : todo)
);

const removeTodo = index => todos => todos.filter((_, i) => i !== index);
```

## Sub-reducers

We do not need to reduce always the whole state of the store. Repatch also offers a way to combine sub-reducers, those describe a deeply nested property in the state. We just define a helper function that takes a nested reducer as argument, and returns a reducer that reduces the whole state:

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

A repatch middleware takes the `store` instance, a `next` function and the previous `reducer`. The middleware can provide a new reducer via the `next` function.

```javascript
Middleware: Store -> Next -> Reducer -> any
```

Use the `addMiddleware` method to chaining middlewares:

```javascript
const store = new Store(initialState)
  .addMiddleware(mw1)
  .addMiddleware(mw2, mw3);
```

## Middleware example

This simple logger middleware logs the current- and the next state:

```javascript
const logger = store => next => reducer => {
  const state = store.getState()
  const nextState = reducer(state)
  console.log(state, nextState)
  return next(_ => nextState)
}

const store = new Store(initialState).addMiddleware(logger)
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
  try {
    const editedUserId = getState().editedUser;
    dispatch(toggleSpinner(true));
    await api.updateUser(editedUserId, delta);
    await dispatch(fetchUsers());
  } catch (error) {
    dispatch(state => ({ ...state, error: error.message }))
  } finally {
    dispatch(toggleSpinner(false));
  }
};
```

It is possible to embed async actions within each other too and awaiting their resolving:

```javascript
await dispatch(fetchUsers());
```

### Injecting extra argument

It is possible to inject extra arguments into async actions:

```javascript
import Store, { thunk } from 'repatch';
import api from './api';
import { hashHistory } from 'react-router';

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

This way you can keep your async actions independently from outer instances or side-effects. This practice is useful for testing.

## Testing

### Sync actions

Testing a reducer is easy:

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

For async action tests you need to instantiate the `Store` and provide mocked extra arguments.

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
    .addMiddleware(thunk.withExtraArgument({ api: mockApi }));
  await store.dispatch(fetchUsers());
  const nextState = store.getState();
  assert.deepEqual(nextState.users, mockUsers);
});
```

---

## License

[MIT](https://spdx.org/licenses/MIT)

## Community

[https://twitter.com/repatchjs](https://twitter.com/repatchjs)

## Developed by

[![JayStack](http://jaystack.com/wp-content/uploads/2017/08/jaystack_logo_transparent_50.png)](http://jaystack.com/)
