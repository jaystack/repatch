import { Middleware, Dispatch, GetState } from './types';

export interface Delegate<S, E, R> {
  (dispatch: Dispatch<S>, getState: GetState<S>, extraArgument: E): R;
}

export interface Thunk<S, E, R> {
  (state: S): Delegate<S, E, R>;
}

declare module './types' {
  export interface Dispatch<S> {
    <R, E = any>(thunk: Thunk<S, E, R>): R;
  }
}

export interface ThunkMiddleware<E> extends Middleware {
  withExtraArgument: <EA>(extraArgument: EA) => ThunkMiddleware<EA>;
}

const thunkFactory = <E>(extraArgument?: E): ThunkMiddleware<E> => {
  const thunk = (store => next => reducer => {
    if (typeof reducer !== 'function') throw new Error('Thunk reducer must return a function');
    const result = reducer(store.getState());
    if (typeof result === 'function') return result(store.dispatch, store.getState, extraArgument);
    else return next(_ => result);
  }) as ThunkMiddleware<E>;

  thunk.withExtraArgument = thunkFactory;

  return thunk;
};

export const thunk = thunkFactory();
