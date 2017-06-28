export interface Store<State> {
  getState(): State;
  dispatch(reducer: any): any;
  subscribe(listener: Listener): Unsubscribe;
  addMiddleware(...middlewares: Middleware<State>[]): this;
}
export type Reducer<State> = (state: State) => State;
export type Listener = () => void;
export type Unsubscribe = () => void;
export interface Middleware<State> {
  (store: Store<State>, reducer: Reducer<State>): Reducer<State>;
}
