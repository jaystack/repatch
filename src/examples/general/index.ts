import store from './store';
import { fetchUsers, addUser, editUser, updateUser } from './actions';

store.subscribe(() => console.log(store.getState()));

(async () => {
	await store.dispatch(fetchUsers());
	await store.dispatch(addUser({ username: 'béla', age: 22 }));
	store.dispatch(editUser('béla'));
	await store.dispatch(updateUser({ age: 33 }));
	store.dispatch(editUser(null));
})();
