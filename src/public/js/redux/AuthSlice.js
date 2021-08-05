/* eslint-disable no-param-reassign */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { userService } from '../services/userService';
import { setNotification } from './NotificationSlice';

const initialState = {
  loading: false,
  error: false,
  errorMessage: null,
  user: null,
};

const register = createAsyncThunk(
  'auth/register',
  async (
    { firstName, lastName, email, password, confirmPassword },
    { rejectWithValue, dispatch },
  ) => {
    try {
      const response = await userService.register({
        firstName,
        lastName,
        email,
        password,
        confirmPassword,
      });
      const { data, message } = await response.data;

      // send success feedback
      dispatch(setNotification({ message, isError: false }));

      return data;
    } catch (err) {
      // log promise rejection error somewhere, display default error message
      const { message } = err.response.data.error;

      dispatch(
        setNotification({
          message,
          isError: true,
        }),
      );
      return rejectWithValue(message);
    }
  },
);

const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { rejectWithValue, dispatch }) => {
    try {
      const response = await userService.login(email, password);
      const { data } = response.data;

      localStorage.setItem('jwtToken', data.jwtToken);

      return data;
    } catch (err) {
      // log promise rejection error somewhere, display default error message
      const { message } = err.response.data.error;

      dispatch(
        setNotification({
          message,
          isError: true,
        }),
      );
      return rejectWithValue(message);
    }
  },
);

const autoLogin = createAsyncThunk(
  'auth/autoLogin',
  async (jwtToken, { rejectWithValue, dispatch }) => {
    try {
      const response = await userService.autoLogin(jwtToken);
      const { data } = await response.data;

      return data;
    } catch (err) {
      const { message } = err.response.data.error;

      dispatch(
        setNotification({
          message,
          isError: true,
        }),
      );
      return rejectWithValue(message);
    }
  },
);

const logout = createAsyncThunk(
  'auth/logout',
  async (jwtToken, { rejectWithValue, dispatch }) => {
    try {
      const response = await userService.logout(jwtToken);
      const { data } = response.data;

      localStorage.removeItem('jwtToken');

      return data;
    } catch (err) {
      const { message } = err.response.data.error;

      dispatch(
        setNotification({
          message,
          isError: true,
        }),
      );
      return rejectWithValue(message);
    }
  },
);

const AuthSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: {
    [register.pending]: (state) => {
      state.loading = true;
    },
    [register.rejected]: (state, { payload }) => {
      state.error = true;
      state.loading = false;
      state.errorMessage = payload;
    },
    [register.fulfilled]: (state) => {
      state.user = null;
      state.loading = false;
      state.error = false;
      state.errorMessage = null;
    },

    [login.pending]: (state) => {
      state.loading = true;
    },
    [login.rejected]: (state, { payload }) => {
      state.error = true;
      state.loading = false;
      state.errorMessage = payload;
    },
    [login.fulfilled]: (state, { payload }) => {
      state.user = payload;
      state.loading = false;
      state.error = false;
      state.errorMessage = null;
    },

    [autoLogin.pending]: (state) => {
      state.loading = true;
    },
    [autoLogin.rejected]: (state, { payload }) => {
      state.error = true;
      state.loading = false;
      state.errorMessage = payload;
    },
    [autoLogin.fulfilled]: (state, { payload }) => {
      state.loading = false;
      state.user = payload;
      state.error = false;
      state.errorMessage = null;
    },

    [logout.pending]: (state) => {
      state.loading = true;
    },
    [logout.rejected]: (state, { payload }) => {
      state.error = true;
      state.loading = false;
      state.errorMessage = payload;
    },
    [logout.fulfilled]: (state) => {
      state.loading = false;
      state.user = null;
      state.error = false;
      state.errorMessage = null;
    },
  },
});

export { register, login, autoLogin, logout };
export default AuthSlice.reducer;
