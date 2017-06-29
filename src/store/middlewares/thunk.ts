import { Middleware, GetState, Dispatch } from '../types';

export interface ThunkMiddleware<State, ExtraArgument>
  extends Middleware<State> {
  withExtraArgument: (
    extraArgument: ExtraArgument
  ) => ThunkMiddleware<State, ExtraArgument>;
}
export type Thunk<State, ExtraArgument> = (
  state: State
) => (
  dispatch: Dispatch,
  state: GetState<State>,
  extraArgument: ExtraArgument
) => any;

function thunkFactory(extraArgument?: any): ThunkMiddleware<any, any> {
  const thunk = ((store, reducer) => {
    const state = store.getState();
    const result = reducer(state);
    return typeof result === 'function'
      ? result(store.dispatch, store.getState, extraArgument)
      : reducer;
  }) as ThunkMiddleware<any, any>;
  thunk.withExtraArgument = thunkFactory;
  return thunk;
}

export default thunkFactory();
