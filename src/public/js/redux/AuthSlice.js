/* eslint-disable no-param-reassign */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { userService } from '../services/userService';
import { setNotification } from './NotificationSlice';
import errorDetails from '../config/error';

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
      const res = await response.json();

      if (!response.ok) {
        dispatch(
          setNotification({ message: res.error.message, isError: true }),
        );
        return rejectWithValue(res.error.message);
      }

      // send success feedback
      dispatch(setNotification({ message: res.message, isError: false }));

      return res;
    } catch (error) {
      // log promise rejection error somewhere, display default error message
      dispatch(
        setNotification({
          message: errorDetails.DEFAULT_ERROR_MSG,
          isError: true,
        }),
      );
      return rejectWithValue(errorDetails.DEFAULT_ERROR_MSG);
    }
  },
);

const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { rejectWithValue, dispatch }) => {
    try {
      const response = await userService.login(email, password);
      const res = await response.json();

      if (!response.ok) {
        dispatch(
          setNotification({ message: res.error.message, isError: true }),
        );
        return rejectWithValue(res.error.message);
      }

      localStorage.setItem('jwtToken', res.data.jwtToken);
      return res;
    } catch (error) {
      // log promise rejection error somewhere, display default error message
      dispatch(
        setNotification({
          message: errorDetails.DEFAULT_ERROR_MSG,
          isError: true,
        }),
      );
      return rejectWithValue(errorDetails.DEFAULT_ERROR_MSG);
    }
  },
);

const autoLogin = createAsyncThunk(
  'auth/autoLogin',
  async (jwtToken, { rejectWithValue, dispatch }) => {
    try {
      const response = await userService.autoLogin(jwtToken);
      const res = await response.json();

      if (!response.ok) {
        dispatch(setNotification(res.error.message));
        return rejectWithValue(res.error.message);
      }

      return res;
    } catch (error) {
      dispatch(setNotification(errorDetails.DEFAULT_ERROR_MSG));
      return rejectWithValue(errorDetails.DEFAULT_ERROR_MSG);
    }
  },
);

const logout = createAsyncThunk(
  'auth/logout',
  async (jwtToken, { rejectWithValue, dispatch }) => {
    try {
      const response = await userService.logout(jwtToken);
      const res = response.json();

      if (!response.ok) {
        dispatch(setNotification(res.error.message));
        return rejectWithValue(res.error.message);
      }

      localStorage.removeItem('jwtToken');
      return res;
    } catch (error) {
      dispatch(setNotification(errorDetails.DEFAULT_ERROR_MSG));
      return rejectWithValue(errorDetails.DEFAULT_ERROR_MSG);
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
    [register.fulfilled]: (state, { payload }) => {
      state.user = payload.data;
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
      state.user = payload.data;
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
      state.user = payload.data;
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
