import { Middleware, GetState, Dispatch, Reducer, Store } from '../types';

export interface ThunkMiddleware<S, EA>
  extends Middleware<S, Reducer<S>, Thunk<S, EA>> {
  (store: Store<S, Reducer<S> | Delegate<S, EA>>): {
    (next: Dispatch<Reducer<S>, S>): Dispatch<Delegate<S, EA>>;
  };
  withExtraArgument: <EA>(extraArgument: EA) => ThunkMiddleware<S, EA>;
}

export interface Delegate<S, EA, RE = any> {
  (dispatch: ThunkDispatch<S, EA>, getState: GetState<S>, extraArgument: EA): RE;
}

export interface Thunk<S, EA, RE = any> {
  (state: S): Delegate<S, EA, RE>;
}

export interface ThunkDispatch<S, EA> extends Dispatch<Reducer<S>, S> {
  <Return>(thunk: Thunk<S, EA, Return>): Return;
}

const thunkFactory = <S, EA>(extraArgument?: EA) => {
  const thunk = (store => next => reducer => {
    if (typeof reducer !== 'function') throw new Error('Thunk requires reducers as functions');
    const state = store.getState();
    const result = reducer(state);
    if (typeof result === 'function') return result(store.dispatch, store.getState, extraArgument);
    else {
      next(_ => result);
      return reducer;
    }
  }) as ThunkMiddleware<S, EA>;
  thunk.withExtraArgument = thunkFactory;
  return thunk;
};

export default thunkFactory() as ThunkMiddleware<any, any>;
