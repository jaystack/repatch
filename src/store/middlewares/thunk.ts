import { Middleware, GetState, Dispatch, Reducer, Store } from '../types';

export interface ThunkMiddleware<State, ExtraArgument>
  extends Middleware<State> {
  withExtraArgument: (
    extraArgument: ExtraArgument
  ) => ThunkMiddleware<State, ExtraArgument>;
}

export interface Delegate<State, ExtraArgument, T> {
  (
    dispatch: ThunkDispatch<State, ExtraArgument>,
    getState: GetState<State>,
    extraArgument: ExtraArgument
  ): T;
}

export interface ThunkDispatch<State, ExtraArgument>
  extends Dispatch<Reducer<State>> {
  <T>(reducer: Thunk<State, ExtraArgument, T>): T;
}

export interface Thunk<State, ExtraArgument, T> {
  (state: State): Delegate<State, ExtraArgument, T>;
}

function thunkFactory<T>(extraArgument?: T): ThunkMiddleware<any, T> {
  const thunk = ((store, reducer) => {
    const state = store.getState();
    const result = reducer(state);
    return typeof result === 'function'
      ? result(store.dispatch, store.getState, extraArgument)
      : reducer;
  }) as ThunkMiddleware<any, T>;
  thunk.withExtraArgument = thunkFactory;
  return thunk;
}

export default thunkFactory();
