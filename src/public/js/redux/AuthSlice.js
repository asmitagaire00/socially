/* eslint-disable no-param-reassign */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { authService } from '../services/AuthService';
import { setNotification } from './NotificationSlice';
import TokenService from '../services/TokenService';

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
      const response = await authService.register({
        firstName,
        lastName,
        email,
        password,
        confirmPassword,
      });
      const { data, message } = response.data;

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
      const response = await authService.login(email, password);
      const { data } = response.data;

      TokenService.setToken(data.jwtToken);

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
  async (jwtToken, { rejectWithValue }) => {
    try {
      const response = await authService.autoLogin(jwtToken);
      const { data } = await response.data;

      return data;
    } catch (err) {
      const { message } = err.response.data.error;

      return rejectWithValue(message);
    }
  },
);

const logout = createAsyncThunk(
  'auth/logout',
  async (jwtToken, { rejectWithValue, dispatch }) => {
    try {
      const response = await authService.logout(jwtToken);
      const { data } = response.data;

      TokenService.removeToken();

      // reset the state of the whole app
      dispatch({ type: 'RESET_APP_STATE' });

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
