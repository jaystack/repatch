let users = [
  {
    username: 'john',
    age: 22
  },
  {
    username: 'april',
    age: 21
  }
];

export const getUsers = () => Promise.resolve(users);
export const addUser = (user) => {
  users = [ ...users, user ];
  return Promise.resolve();
};
export const updateUser = (username, delta) => {
  users = users.map((user) => (user.username === username ? { ...user, ...delta } : user));
  return Promise.resolve();
};
