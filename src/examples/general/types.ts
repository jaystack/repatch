export interface User {
	username: string;
	age: number;
}

export interface State {
	users: User[];
	isFetching: boolean;
	error?: string;
	editedUsername?: string;
}