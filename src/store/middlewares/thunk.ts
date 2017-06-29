import { Middleware, GetState, Dispatch, Reducer } from '../types';

export interface ThunkMiddleware<State, ExtraArgument>
  extends Middleware<State> {
  withExtraArgument: (
    extraArgument: ExtraArgument
  ) => ThunkMiddleware<State, ExtraArgument>;
}

export type Delegate<State, ExtraArgument> = (
  dispatch: ThunkDispatch<State, ExtraArgument>,
  getState: GetState<State>,
  extraArgument: ExtraArgument
) => any;

export type ThunkReducer<State, ExtraArgument> = (
  state: State
) => Delegate<State, ExtraArgument>;

export interface ThunkDispatch<State, ExtraArgument> extends Dispatch<State> {
  (reducer: ThunkReducer<State, ExtraArgument>): any;
}

export type Thunk<State, ExtraArgument> = (
  state: State
) => Delegate<State, ExtraArgument>;

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
