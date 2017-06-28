import { Middleware } from '../types';

export interface Thunk<State> extends Middleware<State> {
  withExtraArgument: (extraArgument: any) => Thunk<State>;
}

function thunkFactory(extraArgument?: any): Thunk<any> {
  const thunk = ((store, reducer) => {
    const state = store.getState();
    const result = reducer(state);
    return typeof result === 'function'
      ? result(store.dispatch, store.getState, extraArgument)
      : reducer;
  }) as Thunk<any>;
  thunk.withExtraArgument = thunkFactory;
  return thunk;
}

export default thunkFactory();
