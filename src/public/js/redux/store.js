import { configureStore } from '@reduxjs/toolkit';

import alertReducer from '../components/Alert/AlertSlice';
import authReducer from './AuthSlice';

const store = configureStore({
  reducer: {
    alert: alertReducer,
    auth: authReducer,
  },
  devTools: process.env.NODE_ENV !== 'production',
});

export default store;
