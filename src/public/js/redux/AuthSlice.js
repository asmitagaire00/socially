/* eslint-disable consistent-return */
/* eslint-disable no-param-reassign */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { userService } from '../services/userService';

const initialState = {
  loading: false,
  error: false,
  errorMessage: '',
  user: null,
};

const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await userService.login(email, password);
      const res = await response.json();

      if (response.status !== 200) return rejectWithValue(res);

      localStorage.setItem('jwtToken', res.jwtToken);
      return res;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

const autoLogin = createAsyncThunk(
  'auth/autoLogin',
  async (jwtToken, { rejectWithValue }) => {
    try {
      const response = await userService.autoLogin(jwtToken);
      const res = await response.json();

      if (response.status !== 200) return rejectWithValue(res);

      return res;
    } catch (error) {
      rejectWithValue(error);
    }
  },
);

const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      const response = await userService.logout();
      const res = response.json();

      if (response.status !== 200) rejectWithValue(res);
      // remove token from localStorage
      localStorage.removeItem('jwtToken');
      return res;
    } catch (error) {
      rejectWithValue(error);
    }
  },
);

const AuthSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: {
    [login.pending]: (state) => {
      state.loading = true;
    },
    [login.rejected]: (state, { payload }) => {
      state.error = true;
      state.loading = false;
      state.errorMessage = payload.message;
    },
    [login.fulfilled]: (state, { payload }) => {
      state.user = payload;
      state.loading = false;
    },

    [autoLogin.pending]: (state) => {
      state.loading = true;
    },
    [autoLogin.rejected]: (state, { payload }) => {
      state.error = true;
      state.loading = false;
      state.errorMessage = payload.message;
    },
    [autoLogin.fulfilled]: (state, { payload }) => {
      state.loading = false;
      state.user = payload;
    },

    [logout.pending]: (state) => {
      state.loading = true;
    },
    [logout.rejected]: (state, { payload }) => {
      state.error = true;
      state.loading = false;
      state.errorMessage = payload.message;
    },
    [logout.fulfilled]: (state) => {
      state.loading = false;
      state.user = null;
    },
  },
});

export { login, autoLogin, logout };
export default AuthSlice.reducer;
