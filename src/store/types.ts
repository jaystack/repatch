export interface GetState<S> {
  (): S;
}

export interface Reducer<State> {
  (state: State): State;
}

export interface Dispatch<R, S = any> {
  (reducer: R): S;
}

export interface Listener {
  (): void;
}

export interface Unsubscribe {
  (): void;
}

export interface Middleware<S, R1, R2> {
  (store: Store<S, R1>): {
    (next: Dispatch<R1, S>): Dispatch<R2>;
  };
}

export interface Store<S, R = Reducer<S>> {
  getState: GetState<S>;
  dispatch: Dispatch<R, S>;
  subscribe(listener: Listener): Unsubscribe;
  addMiddleware<R2>(...middlewares: Middleware<S, R, R2>[]): Store<S, R | R2>;
}
