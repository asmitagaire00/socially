/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  message: null,
  isError: true,
  isOpen: false,
};

const NotificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    setNotification: (state, action) => {
      const { message, isError } = action.payload;

      state.message = message;
      state.isOpen = true;
      state.isError = isError;
    },
    hideNotification: (state) => {
      state.message = null;
      state.isOpen = false;
      state.isError = false;
    },
  },
});

export const { setNotification, hideNotification } = NotificationSlice.actions;
export default NotificationSlice.reducer;
