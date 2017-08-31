export interface GetState<S> {
  (): S;
}

export interface Reducer<S> {
  (state: S): S;
}

export interface Dispatch<S> {
  (reducer: Reducer<S>): S;
}

export interface Listener {
  (): void;
}

export interface Unsubscribe {
  (): void;
}

export interface Middleware {
  <S>(store: Store<S>): {
    (next: Dispatch<S>): {
      (reducer: Reducer<S>): any;
    };
  };
}

export interface Store<S> {
  getState: GetState<S>;
  dispatch: Dispatch<S>;
  subscribe(listener: Listener): Unsubscribe;
  addMiddleware(...middlewares: Middleware[]): this;
}
