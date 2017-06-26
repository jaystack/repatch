export type Dispatcher<State> = (reducer: Reducer<State>) => any;
export type SyncReducer<State> = (state: State) => State;
export type AsyncReducer<State> = (state: State) => (dispatch: Dispatcher<State>, getState: () => State) => any;
export type Reducer<State> = SyncReducer<State> | AsyncReducer<State>;
export type Listener = () => void;
export type Unsubscribe = () => void;
//export type Middleware<State> = (store: Store<State>, reducer: Reducer<State>) => void;

export default class Store<State> {
  private state: State;
  private listeners: Function[] = [];
  private middlewares: Function[] = [];

  constructor(initialState: State) {
    this.state = initialState;
  }

  getState: () => State = () => this.state;

  dispatch: Dispatcher<State> = (reducer) => {
    assertReducer(reducer);
    //const result = this.applyMiddlewares(reducer)(this.state);
    const result = reducer(this.state);
    if (typeof result === 'function') return result(this.dispatch, this.getState);
    this.state = result;
    this.listeners.forEach((listener) => listener());
    return reducer;
  };

  subscribe = (listener: Listener): Unsubscribe => {
    assertListener(listener);
    this.listeners = [ ...this.listeners, listener ];
    return () => (this.listeners = this.listeners.filter((lis) => lis !== listener));
  };

  /*addMiddleware: (...middlewares: Middleware<State>[]) => this = (...middlewares) => {
		this.middlewares = [ ...this.middlewares, ...middlewares ];
		return this;
	};

	applyMiddlewares: (reducer: Reducer<State>) => Reducer<State> = (reducer) =>
		<Reducer<State>>this.middlewares.reduce((prevReducer, middleware) => middleware(this, reducer), reducer);*/
}

function assertReducer(reducer: Reducer<any>) {
  if (typeof reducer !== 'function')
    throw new Error('Reducer is not a function: dispatch takes only reducers as functions.');
}

function assertListener(listener: Listener) {
  if (typeof listener !== 'function')
    throw new Error('Listener is not a function: subscribe takes only listeners as functions.');
}

/*function assertMiddlewares(middlewares: Function[]) {
	middlewares.forEach((middleware) => {
		if (typeof middleware !== 'function')
			throw new Error('Middleware is not a function: addMiddleware takes only middlewares as functions.');
	});
}*/
