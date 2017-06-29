export interface GetState<State> {
  (): State;
}

export interface Reducer<State> {
  (state: State): State;
}

export interface Dispatch<State> {
  <R extends Reducer<State>>(reducer: R): R;
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

export interface Store<State> {
  getState: GetState<State>;
  dispatch: Dispatch<State>;
  subscribe(listener: Listener): Unsubscribe;
  addMiddleware(...middlewares: Middleware<State>[]): this;
}