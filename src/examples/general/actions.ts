import * as api from './api';
import { User } from './types';

export const resolveFetchingUsers = (users) => (state) => ({
  ...state,
  users,
  isFetching: false
});

export const reject = (error) => (state) => ({
  ...state,
  error,
  isFetching: false
});

export const startFetching = () => (state) => ({
  ...state,
  isFetching: true
});

export const editUser = (editedUsername) => (state) => ({
  ...state,
  editedUsername
});

export const fetchUsers = () => (state) => async (dispatch, getState) => {
  try {
    if (!getState().isFetching) dispatch(startFetching());
    const users = await api.getUsers();
    dispatch(resolveFetchingUsers(users));
  } catch (error) {
    dispatch(reject(error.message));
  }
};

export const addUser = (user: User) => (state) => async (
  dispatch,
  getState
) => {
  try {
    if (!getState().isFetching) dispatch(startFetching());
    await api.addUser(user);
    await dispatch(fetchUsers());
  } catch (error) {
    dispatch(reject(error.message));
  }
};

export const updateUser = (delta) => (state) => async (dispatch, getState) => {
  try {
    if (!getState().isFetching) dispatch(startFetching());
    const editedUsername = getState().editedUsername;
    await api.updateUser(editedUsername, delta);
    await dispatch(fetchUsers());
  } catch (error) {
    dispatch(reject(error.message));
  }
};
