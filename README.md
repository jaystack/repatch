# Repatch

## Dispatch reducers

The most of redux projects do not need sctrict action administration. Action types, action creators and reducers' action handlers are mutually assigned to each other.

The simplest way to keep immutable action controlled dataflow is dispatching pure functions (as reducers) to the store.

So we have only actions which return reducers.

```javascript
const resolveFetchingUsers = users => state => ({
  ...state,
  users,
  isFetching: false
});
```

## Installation

```
npm install repatch
```

## How to use

```javascript
import Store from 'repatch';

const store = new Store(initialState);
```

Repatch's interface is the same as Redux, therefore you can use with [react-redux](https://www.npmjs.com/package/react-redux).

```javascript
store.subscribe(() => console.log(store.getState()));

store.dispatch(resolveFetchingUsers(users));
```

## Subreducers

We do not need to reduce always the whole state of the store. A good practice to avoid this effort is using subreducers.

Let's suppose we have the following state:

```javascript
const store = new Store({
  userManagement: {
    users: [...],
    isFetching: false,
    error: null 
  }
});
```

Then we can make a subredcer for the `userManagement` section:

```javascript
const reduceUserManagement = reducer => state => ({
  ...state,
  userManagement: reducer(state.userManagement)
});
```

After that reducing only the `userManagement` state it's easy:

```javascript
const rejectFetchingUsers = error =>
  reduceUserManagement(state => ({ ...state, error, isFetching: false }));
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

const store = new Store(initialState).addMiddleware(thunk());
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

### Extra arguments

It is possible to inject extra arguments into async actions:

```javascript
import Store, { thunk } from 'repatch';
import api from './api';
import hashHistory from 'react-router';

const store = new Store(initialState).addMiddleware(thunk(api, hashHistory));
```

Then you can access these arguments in your delegates:

```javascript
const updateUser = delta => state =>
  async (dispatch, getState, api, hashHistory) => {
    // ...
  }
```

This way you can keep your async actions independently from outer instances. This practice is useful for testing.

## Testing

### Sync actions

Sync actions' testing is easy:

```javascript
import * as assert from 'assert';
import changeName from './actions';

// ...

const state = { name: 'hello' };
const nextState = changeName('hi')(state);
assert.strictEqual(nextState.name, 'hi');
```

### Async actions

For async action tests you need to instantiate the `Store`:

```javascript
import Store, { thunk } from 'repatch';
import * as assert from 'assert';

const mockUsers = [{ username: 'john' }];
const mockApi = {
  getUsers: () => Promise.resolve(mockUsers)
}

// ...

it('fetchUsers', async () => {
  const state = { users: [] };
  const store = new Store(state).addMiddleware(thunk(mockApi));
  await store.dispatch(fetchUsers());
  const nextState = store.getState();
  assert.deepEqual(nextState.users, mockUsers);
});
```