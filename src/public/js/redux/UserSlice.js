/* eslint-disable no-param-reassign */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import userService from '../services/UserService';
import { setNotification } from './NotificationSlice';

const getFollowersById = createAsyncThunk(
  'user/getFollowersById',
  async ({ userId, skip, limit }, { rejectWithValue, dispatch }) => {
    try {
      const response = await userService.getFollowersById({
        userId,
        skip,
        limit,
      });
      const { data } = response.data;

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

const getFollowingsById = createAsyncThunk(
  'user/getFollowingsById',
  async ({ userId, skip, limit }, { rejectWithValue, dispatch }) => {
    try {
      const response = await userService.getFollowingsById({
        userId,
        skip,
        limit,
      });
      const { data } = response.data;

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

const followUser = createAsyncThunk(
  'user/followUser',
  async ({ id }, { rejectWithValue, dispatch }) => {
    try {
      const response = await userService.followUser({ id });
      const { data } = response.data;

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

const unfollowUser = createAsyncThunk(
  'user/unfollowUser',
  async ({ id }, { rejectWithValue, dispatch }) => {
    try {
      const response = await userService.unfollowUser({ id });
      const { data } = response.data;

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

const UserSlice = createSlice({
  name: 'user',
  initialState: {
    loading: false,
    followerDetails: null,
    followingDetails: null,
  },
  extraReducers: {
    [getFollowersById.pending]: (state) => {
      state.loading = true;
    },
    [getFollowersById.rejected]: (state) => {
      state.loading = false;
      state.followerDetails = null;
    },
    [getFollowersById.fulfilled]: (state, { payload }) => {
      state.loading = false;
      state.followerDetails = payload;
    },

    [getFollowingsById.pending]: (state) => {
      state.loading = true;
    },
    [getFollowingsById.rejected]: (state) => {
      state.loading = false;
      state.followingDetails = null;
    },
    [getFollowingsById.fulfilled]: (state, { payload }) => {
      state.loading = false;
      state.followingDetails = payload;
    },

    [followUser.pending]: (state) => {
      state.loading = true;
    },
    [followUser.rejected]: (state) => {
      state.loading = false;
    },
    [followUser.fulfilled]: (state) => {
      state.loading = false;
      if (state.followerDetails)
        state.followerDetails.isCurUserFollowingUser = true;
    },

    [unfollowUser.pending]: (state) => {
      state.loading = true;
    },
    [unfollowUser.rejected]: (state) => {
      state.loading = false;
    },
    [unfollowUser.fulfilled]: (state) => {
      state.loading = false;
      if (state.followerDetails)
        state.followerDetails.isCurUserFollowingUser = false;
    },
  },
});

export { getFollowersById, getFollowingsById, followUser, unfollowUser };
export default UserSlice.reducer;
