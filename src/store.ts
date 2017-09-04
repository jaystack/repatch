import { Store as IStore, Listener, Unsubscribe, Middleware, Reducer, Dispatch, GetState } from './types';

export * from './types';
export * from './thunk';

export class Store<S> implements IStore<S> {
  private state: S;
  private listeners: Listener[] = [];
  private isDispatching: boolean = false;

  constructor(initialState: S) {
    this.state = initialState;
  }

  getState: GetState<S> = () => this.state;

  dispatch: Dispatch<S> = reducer => {
    if (typeof reducer !== 'function')
      throw new Error('Reducer is not a function: dispatch takes only reducers as functions.');
    if (this.isDispatching) throw new Error('Reducers may not dispatch actions.');
    this.isDispatching = true;
    try {
      this.state = reducer(this.state);
    } finally {
      this.isDispatching = false;
    }
    for (let i = 0; i<this.listeners.length; ++i)
      this.listeners[i]();
    return this.state;
  };

  subscribe = (listener: Listener): Unsubscribe => {
    if (typeof listener !== 'function')
      throw new Error('Listener is not a function: subscribe takes only listeners as functions.');
    this.listeners = [ ...this.listeners, listener ];
    return () => (this.listeners = this.listeners.filter(lis => lis !== listener));
  };

  addMiddleware = (...middlewares: Middleware[]): this => {
    if (middlewares.some(middleware => typeof middleware !== 'function'))
      throw new Error('Middleware is not a function: addMiddleware takes only middlewares as functions.');
    middlewares.forEach(middleware => (this.dispatch = middleware(this)(this.dispatch) as any));
    return this;
  };
}

export default Store;
