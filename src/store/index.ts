export type Reducer<State> = (state: State) => State;
export type Listener = () => void;
export type Unsubscribe = () => void;
export type Middleware<State> = (
  store: Store<State>,
  reducer: Reducer<State>
) => Reducer<State>;
import thunkMiddleware from './middlewares/thunk';

export const thunk = thunkMiddleware;

export default class Store<State> {
  private state: State;
  private listeners: Function[] = [];
  private middlewares: Function[] = [];

  constructor(initialState: State) {
    this.state = initialState;
  }

  getState = (): State => this.state;

  dispatch = (reducer: any): any => {
    assertReducer(reducer);
    const finalReducer = this.applyMiddlewares(reducer);
    if (typeof finalReducer === 'function') {
      this.state = finalReducer(this.state);
      this.listeners.forEach((listener) => listener());
    }
    return finalReducer;
  };

  subscribe = (listener: Listener): Unsubscribe => {
    assertListener(listener);
    this.listeners = [ ...this.listeners, listener ];
    return () =>
      (this.listeners = this.listeners.filter((lis) => lis !== listener));
  };

  addMiddleware = (...middlewares: Middleware<State>[]): this => {
    assertMiddlewares(middlewares);
    this.middlewares = [ ...this.middlewares, ...middlewares ];
    return this;
  };

  applyMiddlewares = (reducer: Reducer<State>): Reducer<State> =>
    <Reducer<State>>this.middlewares.reduce(
      (prevReducer, middleware) => middleware(this, prevReducer),
      reducer
    );
}

function assertReducer(reducer: Reducer<any>) {
  if (typeof reducer !== 'function')
    throw new Error(
      'Reducer is not a function: dispatch takes only reducers as functions.'
    );
}

function assertListener(listener: Listener) {
  if (typeof listener !== 'function')
    throw new Error(
      'Listener is not a function: subscribe takes only listeners as functions.'
    );
}

function assertMiddlewares(middlewares: Middleware<any>[]) {
  if (middlewares.some((middleware) => typeof middleware !== 'function')) {
    throw new Error(
      'Middleware is not a function: addMiddleware takes only middlewares as functions.'
    );
  }
}
