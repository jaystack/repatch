export interface User {
	username: string;
	age: number;
}

export interface Book {
	title: string;
	author: User;
}

export interface State {
	userManagement: {
		users: User[];
		isFetching: boolean;
		error?: string;
	};
	bookManagement: {
		books: Book[];
		isFetching: boolean;
		error?: string;
	};
}
