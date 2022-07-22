import { setAlert } from './alert';
import axios from 'axios';
import setAuthToken from '../utils/setAuthToken'
import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  CLEAR_PROFILE,
  UPDATE_FOLLOWS
} from './types';

export const loadUser = () => async (dispatch) => {
  if (localStorage.token) setAuthToken(localStorage.token);
  try {
    const res = await axios.get('/api/auth');
    dispatch({
      type: USER_LOADED,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: AUTH_ERROR
    });
  }
};

export const register = (formData) => async (dispatch) => {
  try {
    const res = await axios.post('/api/users', formData);
    dispatch({
      type: REGISTER_SUCCESS,
      payload: res.data
    });
    dispatch(loadUser());
  } catch (err) {
    const errors = err.response.data.errors;
    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
    }
    dispatch({
      type: REGISTER_FAIL
    });
  }
};

export const login = (email, password) => async (dispatch) => {
  try {
    const res = await axios.post('/api/auth', { email, password });
    dispatch({
      type: LOGIN_SUCCESS,
      payload: res.data
    });
    dispatch(loadUser());
  } catch (err) {
    const errors = err.response.data.errors;
    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
    }
    dispatch({
      type: LOGIN_FAIL
    });
  }
};

export const logout = () => async (dispatch) => {
  dispatch({ type: LOGOUT });
  dispatch({ type: CLEAR_PROFILE });
};

export const follow = (id) => async (dispatch) => {
  try {
    const res = await axios.put(`/api/users/follow/${id}`);
    dispatch({
      type: UPDATE_FOLLOWS,
      payload: res.data
    });
  } catch (err) {
    const errors = err.response.data.errors;
    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
    }
  }
};

export const unfollow = (id) => async (dispatch) => {
  try {
    const res = await axios.put(`/api/users/unfollow/${id}`);
    dispatch({
      type: UPDATE_FOLLOWS,
      payload: res.data
    });
  } catch (err) {
    const errors = err.response.data.errors;
    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
    }
  }
};