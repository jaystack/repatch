import { Middleware, GetState, Dispatch, Reducer, Store } from '../types';

export interface ThunkMiddleware<State, ExtraArgument>
  extends Middleware<State, Reducer<State>, Thunk<State, ExtraArgument, any>> {
  withExtraArgument: <EA>(extraArgument: EA) => ThunkMiddleware<State, EA>;
}

export interface Delegate<State, ExtraArgument, Return> {
  (dispatch: ThunkDispatch<State, ExtraArgument>, getState: GetState<State>, extraArgument: ExtraArgument): Return;
}

export interface ThunkDispatch<State, ExtraArgument> extends Dispatch<Reducer<State>> {
  <Return>(reducer: Thunk<State, ExtraArgument, Return>): Return;
}

export interface Thunk<State, ExtraArgument, Return> {
  (state: State): Delegate<State, ExtraArgument, Return>;
}

const thunkFactory = (extraArgument?) => {
  const thunk = store => next => reducer => {
    if (typeof reducer !== 'function') throw new Error('Thunk requires reducers as functions');
    const state = store.getState();
    const result = reducer(state);
    if (typeof result === 'function') return result(store.dispatch, store.getState, extraArgument);
    else {
      next(_ => result);
      return reducer;
    }
  };
  thunk['withExtraArgument'] = thunkFactory;
  return thunk;
};

export default thunkFactory() as ThunkMiddleware<any, any>;
