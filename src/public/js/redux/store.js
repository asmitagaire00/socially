import { configureStore } from '@reduxjs/toolkit';

import { reducer as formReducer } from 'redux-form';
import authReducer from './AuthSlice';
import notificationReducer from './NotificationSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    notification: notificationReducer,
    form: formReducer,
  },
  devTools: process.env.NODE_ENV !== 'production',
});

export default store;
