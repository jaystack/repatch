export interface Store<State> {
  getState: GetState<State>;
  dispatch: Dispatch;
  subscribe(listener: Listener): Unsubscribe;
  addMiddleware(...middlewares: Middleware<State>[]): this;
}
export type GetState<State> = () => State;
export type Dispatch = (any) => any;
export type Reducer<State> = (state: State) => State;
export type Listener = () => void;
export type Unsubscribe = () => void;
export interface Middleware<State> {
  (store: Store<State>, reducer: Reducer<State>): Reducer<State>;
}
