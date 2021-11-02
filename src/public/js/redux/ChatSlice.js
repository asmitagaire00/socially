/* eslint-disable no-param-reassign */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import chatService from '../services/ChatService';
import { setNotification } from './NotificationSlice';

const getConversations = createAsyncThunk(
  'chat/getConversations',
  async ({ userId }, { rejectWithValue, dispatch }) => {
    try {
      const response = await chatService.getConversations({ userId });
      const { data } = response.data;

      return data;
    } catch (err) {
      // const { message } = err.response.data.error;
      const message = 'Could not fetch conversations!';

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

const createConversation = createAsyncThunk(
  'chat/createConversation',
  async ({ userIds }, { rejectWithValue, dispatch }) => {
    try {
      const response = await chatService.createConversation({ userIds });
      const { data } = response.data;

      return data;
    } catch (err) {
      const { message } = err.response.data.error;
      // const message = 'Could not create conversation!';

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

const getMessages = createAsyncThunk(
  'chat/getMessages',
  async ({ convId }, { rejectWithValue, dispatch }) => {
    try {
      const response = await chatService.getMessages({ convId });
      const { data } = response.data;

      return data;
    } catch (err) {
      // const { message } = err.response.data.error;
      const message = 'Could not fetch messages!';

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

const markCurrentConversationSeen = createAsyncThunk(
  'chat/markCurrentConversationSeen',
  async ({ convId, userIds }, { rejectWithValue, dispatch }) => {
    try {
      const response = await chatService.markConvAsSeen({
        convId,
        userIds,
      });
      const { data } = response.data;

      return data;
    } catch (err) {
      // const { message } = err.response.data.error;
      const message = 'Could not mark conversation as seen!';

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

const createMessage = createAsyncThunk(
  'chat/createMessage',
  async ({ convId, senderId, text, seenBy }, { rejectWithValue, dispatch }) => {
    try {
      const response = await chatService.createMessage({
        convId,
        senderId,
        text,
        seenBy,
      });
      const { data } = response.data;

      return data;
    } catch (err) {
      // const { message } = err.response.data.error;
      const message = 'Could not create message!';

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

const ChatSlice = createSlice({
  name: 'chat',
  initialState: {
    conversations: {
      loading: false,
      conversations: null,
    },
    messages: {
      loading: false,
      messages: null,
    },
    currentConversation: null,
    currentConversationSeen: true,
    typing: false,
    error: false,
    errorMessage: null,
  },
  reducers: {
    setCurrentConversation: (state, { payload }) => {
      state.currentConversation = payload;
    },

    setCurrentConversationSeen: (state, { payload }) => {
      state.currentConversation = payload;
    },

    setTyping: (state, { payload }) => {
      state.typing = payload;
    },
    addNewMessage: (state, { payload }) => {
      state.messages.messages.push(payload);
    },
  },
  extraReducers: {
    [getConversations.pending]: (state) => {
      state.conversations.loading = true;
    },
    [getConversations.rejected]: (state, { payload }) => {
      state.conversations.loading = false;
      state.error = true;
      state.errorMessage = payload;
    },
    [getConversations.fulfilled]: (state, { payload }) => {
      state.conversations.loading = false;
      state.conversations.conversations = payload;
      state.error = false;
      state.errorMessage = null;
    },

    [createConversation.pending]: (state) => {
      state.conversations.loading = true;
    },
    [createConversation.rejected]: (state, { payload }) => {
      state.conversations.loading = false;
      state.error = true;
      state.errorMessage = payload;
    },
    [createConversation.fulfilled]: (state, { payload }) => {
      state.conversations.loading = false;
      state.conversations?.conversations?.push(payload);
      state.error = false;
      state.errorMessage = null;
    },

    [getMessages.pending]: (state) => {
      state.messages.loading = true;
    },
    [getMessages.rejected]: (state, { payload }) => {
      state.messages.loading = false;
      state.error = true;
      state.errorMessage = payload;
    },
    [getMessages.fulfilled]: (state, { payload }) => {
      state.messages.loading = false;
      state.messages.messages = payload;
      state.error = false;
      state.errorMessage = null;
    },

    [createMessage.pending]: (state) => {
      state.messages.loading = true;
    },
    [createMessage.rejected]: (state, { payload }) => {
      state.messages.loading = false;
      state.error = true;
      state.errorMessage = payload;
    },
    [createMessage.fulfilled]: (state, { payload }) => {
      state.messages.messages.push(payload);
      state.messages.loading = false;
      state.error = false;
      state.errorMessage = null;
    },

    [markCurrentConversationSeen.rejected]: (state, { payload }) => {
      state.error = true;
      state.errorMessage = payload;
    },
    [markCurrentConversationSeen.fulfilled]: (state, { payload }) => {
      state.currentConversation = payload;
      state.currentConversationSeen = true;
      state.error = false;
      state.errorMessage = null;
    },
  },
});

const {
  addNewMessage,
  setCurrentConversation,
  setTyping,
  setCurrentConversationSeen,
} = ChatSlice.actions;

export {
  addNewMessage,
  getMessages,
  createMessage,
  getConversations,
  setCurrentConversation,
  setTyping,
  markCurrentConversationSeen,
  setCurrentConversationSeen,
  createConversation,
};
export default ChatSlice.reducer;
