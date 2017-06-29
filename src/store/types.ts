export interface GetState<State> {
  (): State;
}

export interface Reducer<State> {
  (state: State): State;
}

export interface Dispatch<Reducer> {
  (reducer: Reducer): Reducer;
}

export interface Listener {
  (): void;
}

export interface Unsubscribe {
  (): void;
}

export interface Middleware<State> {
  (store: Store<State>, reducer: Reducer<State>): Reducer<State>;
}

export interface Store<State, R = Reducer<State>> {
  getState: GetState<State>;
  dispatch: Dispatch<R>;
  subscribe(listener: Listener): Unsubscribe;
  addMiddleware<R2>(...middlewares: Middleware<State>[]): Store<State, R | R2>;
}
