/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

const AlertSlice = createSlice({
  name: 'Alert',
  initialState: {
    open: false,
    title: 'Error',
    text: 'Some error',
  },
  reducers: {
    closeAlert: (state) => {
      state.open = false;
    },
    showAlert: (state) => {
      state.open = true;
    },
  },
});

export const { showAlert, closeAlert } = AlertSlice.actions;
export default AlertSlice.reducer;
