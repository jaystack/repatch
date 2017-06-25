# Repatch

## Dispatch the reducers

The most of projects do not need sctrict action administration. Action types, action creators and reducers' action handlers are mutually assigned to each other.

The simplest way to keep immutable action controlled dataflow is dispatching pure functions (as reducers) to the store.

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

const store = new Store(initialState)
```

Repatch's interface is the same as Redux, therefore you can use with `react-redux`.

```javascript
store.subscribe(() => console.log(store.getState()));

store.dispatch(resolveFetchingUsers(users));
```

## Async actions

In async actions reducer returns a function. 

```javascript
const updateUser = (delta) => (state) => async (dispatch, getState) => {
  const editedUserId = getState().editedUser;
  dispatch(toggleSpinner(true));
  await api.updateUser(editedUserId, delta);
  dispatch(toggleSpinner(false));
};
```