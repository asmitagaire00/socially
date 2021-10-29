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
  async ({ skip, limit, followed }, { rejectWithValue, dispatch }) => {
    try {
      const response = await postService.getPosts({ skip, limit, followed });
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

const getPostsByUserName = createAsyncThunk(
  'post/getPostsByUserName',
  async ({ userName, skip, limit }, { rejectWithValue, dispatch }) => {
    try {
      const response = await postService.getPostsByUserName({
        userName,
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
    // followedPosts: [],
    // totalFollowedPostsCount: -1,
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
      state.posts.unshift(payload);
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
      state.totalPostsCount = payload.count;
      state.loading = false;
      state.error = false;
      state.errorMessage = null;
    },

    [getPostsByUserName.pending]: (state) => {
      state.loading = true;
    },
    [getPostsByUserName.rejected]: (state, { payload }) => {
      state.error = true;
      state.errorMessage = payload;
      state.loading = false;
    },
    [getPostsByUserName.fulfilled]: (state, { payload }) => {
      state.posts.push(...payload.posts);
      state.totalPostsCount = payload.count;
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
  clearPosts,
  createPost,
  getPosts,
  getPostsByUserName,
  createComment,
  createLike,
  removeLike,
};
export default PostSlice.reducer;
