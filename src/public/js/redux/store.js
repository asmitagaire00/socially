import { configureStore } from '@reduxjs/toolkit';

import alertReducer from '../components/Alert/AlertSlice';

const store = configureStore({
  reducer: {
    alert: alertReducer,
  },
  devTools: process.env.NODE_ENV !== 'production',
});

export default store;
