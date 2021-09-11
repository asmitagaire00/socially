import { configureStore } from '@reduxjs/toolkit';

import { reducer as formReducer } from 'redux-form';
import authReducer from './AuthSlice';
import notificationReducer from './NotificationSlice';
import postReducer from './PostSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    notification: notificationReducer,
    post: postReducer,
    form: formReducer,
  },
  devTools: process.env.NODE_ENV !== 'production',
});

export default store;
