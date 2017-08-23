import { Middleware, GetState, Dispatch, Reducer, Store } from '../types';

export interface ThunkMiddleware<State, ExtraArgument>
  extends Middleware<State, Reducer<State>, Thunk<State, ExtraArgument>> {
  (store: Store<State, Reducer<State> | Delegate<State, ExtraArgument>>): {
    (next: Dispatch<Reducer<State>, State>): Dispatch<Delegate<State, ExtraArgument>>;
  };
  withExtraArgument: <EA>(extraArgument: EA) => ThunkMiddleware<State, EA>;
}

export interface Delegate<State, ExtraArgument, Return = any> {
  (dispatch: ThunkDispatch<State, ExtraArgument>, getState: GetState<State>, extraArgument: ExtraArgument): Return;
}

export interface Thunk<State, ExtraArgument, Return = any> {
  (state: State): Delegate<State, ExtraArgument, Return>;
}

export interface ThunkDispatch<State, ExtraArgument> extends Dispatch<Reducer<State>, State> {
  <Return>(thunk: Thunk<State, ExtraArgument, Return>): Return;
}

const thunkFactory = <State, ExtraArgument>(extraArgument?: ExtraArgument) => {
  const thunk = (store => next => reducer => {
    if (typeof reducer !== 'function') throw new Error('Thunk requires reducers as functions');
    const state = store.getState();
    const result = reducer(state);
    if (typeof result === 'function') return result(store.dispatch, store.getState, extraArgument);
    else {
      next(_ => result);
      return reducer;
    }
  }) as ThunkMiddleware<State, ExtraArgument>;
  thunk.withExtraArgument = thunkFactory;
  return thunk;
};

export default thunkFactory() as ThunkMiddleware<any, any>;
