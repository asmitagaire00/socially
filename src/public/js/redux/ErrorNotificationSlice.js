/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  errorMessage: null,
  isOpen: false,
};

const ErrorNotificationSlice = createSlice({
  name: 'error',
  initialState,
  reducers: {
    setError: (state, action) => {
      state.errorMessage = action.payload;
      state.isOpen = true;
    },
    hideError: (state) => {
      state.errorMessage = null;
      state.isOpen = false;
    },
  },
});

export const { setError, hideError } = ErrorNotificationSlice.actions;
export default ErrorNotificationSlice.reducer;
