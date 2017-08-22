import { Store as IStore, Listener, Unsubscribe, Middleware, Reducer, Dispatch, GetState } from './types';
import thunk, { ThunkMiddleware } from './middlewares/thunk';

export * from './types';
export * from './middlewares/thunk';
export { thunk };

export default class Store<State, R = Reducer<State>> implements IStore<State, R> {
  static thunk = thunk;

  private state: State;
  private listeners: Listener[] = [];

  constructor(initialState: State) {
    this.state = initialState;
  }

  getState: GetState<State> = () => this.state;

  dispatch: Dispatch<R> = reducer => {
    if (typeof reducer !== 'function')
      throw new Error('Reducer is not a function: dispatch takes only reducers as functions.');
    this.state = reducer(this.state);
    this.listeners.forEach(listener => listener());
    return <R>reducer;
  };

  subscribe = (listener: Listener): Unsubscribe => {
    if (typeof listener !== 'function')
      throw new Error('Listener is not a function: subscribe takes only listeners as functions.');
    this.listeners = [ ...this.listeners, listener ];
    return () => (this.listeners = this.listeners.filter(lis => lis !== listener));
  };

  addMiddleware = <R2>(...middlewares: Middleware<State, R, R2>[]): Store<State, R | R2> => {
    if (middlewares.some(middleware => typeof middleware !== 'function'))
      throw new Error('Middleware is not a function: addMiddleware takes only middlewares as functions.');
    middlewares.forEach(middleware => (this.dispatch = middleware(this)(this.dispatch) as any));
    return this;
  };
}
