const reduceUserManagement = (reducer) => (state) => ({ ...state, userManagement: reducer(state.userManagement) });

const reduceUsers = (reducer) => reduceUserManagement((state) => ({ ...state, users: reducer(state.users) }));

const dropUser = (username) => reduceUsers((state) => state.filter((user) => user.username !== username));
