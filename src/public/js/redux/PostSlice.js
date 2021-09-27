/* eslint-disable no-param-reassign */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { setNotification } from './NotificationSlice';
import postService from '../services/PostService';

const createPost = createAsyncThunk(
  'post/createPost',
  async ({ caption, image }, { rejectWithValue, dispatch }) => {
    try {
      const response = await postService.addPost({ caption, image });
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

const getPosts = createAsyncThunk(
  'post/getPosts',
  async ({ skip, limit, all }, { rejectWithValue, dispatch }) => {
    try {
      const response = await postService.getPosts({ skip, limit }, all);
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

const getFollowedPosts = createAsyncThunk(
  'post/getFollowedPosts',
  async ({ skip, limit }, { rejectWithValue, dispatch }) => {
    try {
      const response = await postService.getFollowedPosts({ skip, limit });
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

const createComment = createAsyncThunk(
  'post/createComment',
  async ({ comment, postId }, { rejectWithValue, dispatch }) => {
    try {
      const response = await postService.addComment({ comment, postId });
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

const createLike = createAsyncThunk(
  'post/createLike',
  async ({ postId }, { rejectWithValue, dispatch }) => {
    try {
      const response = await postService.likePost({ postId });
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

const removeLike = createAsyncThunk(
  'post/removeLike',
  async ({ likeId }, { rejectWithValue, dispatch }) => {
    try {
      const response = await postService.unlikePost({ likeId });
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

const PostSlice = createSlice({
  name: 'post',
  initialState: {
    posts: [],
    followedPosts: [],
    totalFollowedPostsCount: -1,
    totalPostsCount: -1, // post not fetched from api, will be 0 if fetched with 0 posts
    loading: false,
    error: false,
    errorMessage: null,
  },
  reducers: {
    clearPosts: (state) => {
      state.posts = [];
    },
  },
  extraReducers: {
    [createPost.pending]: (state) => {
      state.loading = true;
    },
    [createPost.rejected]: (state, { payload }) => {
      state.error = true;
      state.errorMessage = payload;
      state.loading = false;
    },
    [createPost.fulfilled]: (state, { payload }) => {
      state.followedPosts.unshift(payload);
      state.loading = false;
      state.error = false;
      state.errorMessage = null;
    },

    [getPosts.pending]: (state) => {
      state.loading = true;
    },
    [getPosts.rejected]: (state, { payload }) => {
      state.error = true;
      state.errorMessage = payload;
      state.loading = false;
    },
    [getPosts.fulfilled]: (state, { payload }) => {
      state.posts.push(...payload.posts);
      state.totalPostsCount =
        payload.posts.length === 0 ? state.totalPostsCount + 1 : payload.count;
      state.loading = false;
      state.error = false;
      state.errorMessage = null;
    },

    [getFollowedPosts.pending]: (state) => {
      state.loading = true;
    },
    [getFollowedPosts.rejected]: (state, { payload }) => {
      state.error = true;
      state.errorMessage = payload;
      state.loading = false;
    },
    [getFollowedPosts.fulfilled]: (state, { payload }) => {
      state.followedPosts.push(...payload.posts);
      state.totalFollowedPostsCount =
        payload.posts.length === 0
          ? state.totalFollowedPostsCount + 1
          : payload.count;
      state.loading = false;
      state.error = false;
      state.errorMessage = null;
    },

    [createComment.pending]: (state) => {
      state.loading = true;
    },
    [createComment.rejected]: (state, { payload }) => {
      state.error = true;
      state.errorMessage = payload;
      state.loading = false;
    },
    [createComment.fulfilled]: (state, { payload }) => {
      const { post: postId } = payload;

      state.posts = state.posts.map((post) => {
        if (post.id === postId) post.comments.unshift(payload);
        return post;
      });

      state.loading = false;
      state.error = false;
      state.errorMessage = null;
    },

    [createLike.pending]: (state) => {
      state.loading = true;
    },
    [createLike.rejected]: (state, { payload }) => {
      state.error = true;
      state.errorMessage = payload;
      state.loading = false;
    },
    [createLike.fulfilled]: (state, { payload }) => {
      const { post: postId } = payload;

      state.posts = state.posts.map((post) => {
        if (post.id === postId) post.likes.unshift(payload);
        return post;
      });

      state.loading = false;
      state.error = false;
      state.errorMessage = null;
    },

    [removeLike.pending]: (state) => {
      state.loading = true;
    },
    [removeLike.rejected]: (state, { payload }) => {
      state.error = true;
      state.errorMessage = payload;
      state.loading = false;
    },
    [removeLike.fulfilled]: (state, { payload }) => {
      const { id: likeId } = payload;

      state.posts = state.posts.map((post) => {
        post.likes = post.likes.filter((like) => like.id !== likeId);
        return post;
      });

      state.loading = false;
      state.error = false;
      state.errorMessage = null;
    },
  },
});

const { clearPosts } = PostSlice.actions;
export {
  createPost,
  getPosts,
  getFollowedPosts,
  createComment,
  createLike,
  removeLike,
  clearPosts,
};
export default PostSlice.reducer;
