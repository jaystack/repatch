import { Middleware } from '..';

export default function thunk(...extraArguments: any[]): Middleware<any> {
  return (store, reducer) => {
    const state = store.getState();
    const result = reducer(state);
    return typeof result === 'function'
      ? result(store.dispatch, store.getState, ...extraArguments)
      : reducer;
  };
}
