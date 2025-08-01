import { configureStore } from '@reduxjs/toolkit';
import pollReducer from './slices/pollSlice';
import userReducer from './slices/userSlice';

export const store = configureStore({
  reducer: {
    poll: pollReducer,
    user: userReducer,
  },
});