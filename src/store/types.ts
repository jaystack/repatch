export interface GetState<State> {
  (): State;
}

export interface Reducer<State> {
  (state: State): State;
}

export interface Dispatch<Reducer, State = any> {
  (reducer: Reducer): State;
}

export interface Listener {
  (): void;
}

export interface Unsubscribe {
  (): void;
}

export interface Middleware<State, R1, R2> {
  (store: Store<State, R1>): {
    (next: Dispatch<R1, State>): Dispatch<R2>;
  };
}

export interface Store<State, R = Reducer<State>> {
  getState: GetState<State>;
  dispatch: Dispatch<R, State>;
  subscribe(listener: Listener): Unsubscribe;
  addMiddleware<R2>(...middlewares: Middleware<State, R, R2>[]): Store<State, R | R2>;
}
