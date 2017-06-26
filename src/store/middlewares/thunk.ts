import { Dispatcher, Middleware } from '..';

export type Delegate<State> = (
  dispatch: Dispatcher<State>,
  getState: () => State,
  ...extraArguments: any[]
) => any;
export type AsyncReducer<State> = (state: State) => Delegate<State>;

export default function thunk(...extraArguments: any[]): Middleware<any> {
  return (store, reducer) => {
    const state = store.getState();
    const result = reducer(state);
    return typeof result === 'function'
      ? () => {
          result(store.dispatch, store.getState, ...extraArguments);
          return state;
        }
      : reducer;
  };
}
