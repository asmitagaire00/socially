import { configureStore } from '@reduxjs/toolkit';

import alertReducer from '../components/Alert/AlertSlice';
import authReducer from './AuthSlice';
import errorReducer from './ErrorNotificationSlice';

const store = configureStore({
  reducer: {
    alert: alertReducer,
    auth: authReducer,
    errorNotification: errorReducer,
  },
  devTools: process.env.NODE_ENV !== 'production',
});

export default store;
