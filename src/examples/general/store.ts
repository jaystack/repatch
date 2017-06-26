import Store from '../../store';
import { State } from './types';

export default new Store<State>({
  users: [],
  isFetching: false,
  error: null,
  editedUsername: null
});
