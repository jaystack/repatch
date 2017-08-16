import { Store as IStore, Listener, Unsubscribe, Middleware, Reducer, Dispatch, GetState } from './types';
import thunk, { ThunkMiddleware } from './middlewares/thunk';

export * from './types';
export * from './middlewares/thunk';
export { thunk };

export default class Store<State, R = Reducer<State>> implements IStore<State, R> {
  static thunk = thunk;

  private state: State;
  private listeners: Function[] = [];
  private middlewares: Function[] = [];

  constructor(initialState: State) {
    this.state = initialState;
  }

  getState: GetState<State> = () => this.state;

  dispatch: Dispatch<R> = reducer => {
    assertReducer(reducer);
    const finalReducer = this.applyMiddlewares(reducer);
    if (typeof finalReducer === 'function') {
      this.state = finalReducer(this.state);
      this.listeners.forEach(listener => listener());
    }
    return <R>finalReducer;
  };

  subscribe = (listener: Listener): Unsubscribe => {
    assertListener(listener);
    this.listeners = [ ...this.listeners, listener ];
    return () => (this.listeners = this.listeners.filter(lis => lis !== listener));
  };

  addMiddleware = <R2>(...middlewares: Middleware<State>[]): Store<State, R | R2> => {
    assertMiddlewares(middlewares);
    this.middlewares = [ ...this.middlewares, ...middlewares ];
    return this;
  };

  private applyMiddlewares = (reducer: R): R =>
    <R>this.middlewares.reduce((prevReducer, middleware) => middleware(this, prevReducer), reducer);
}

function assertReducer(reducer) {
  if (typeof reducer !== 'function')
    throw new Error('Reducer is not a function: dispatch takes only reducers as functions.');
}

function assertListener(listener) {
  if (typeof listener !== 'function')
    throw new Error('Listener is not a function: subscribe takes only listeners as functions.');
}

function assertMiddlewares(middlewares) {
  if (middlewares.some(middleware => typeof middleware !== 'function')) {
    throw new Error('Middleware is not a function: addMiddleware takes only middlewares as functions.');
  }
}
