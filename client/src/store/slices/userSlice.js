import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  name: '',
  role: '', // 'teacher' or 'student'
  hasAnswered: false,
  isConnected: false,
  selectedAnswer: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.name = action.payload.name;
      state.role = action.payload.role;
    },
    setConnected: (state, action) => {
      state.isConnected = action.payload;
    },
    setHasAnswered: (state, action) => {
      state.hasAnswered = action.payload;
    },
    setSelectedAnswer: (state, action) => {
      state.selectedAnswer = action.payload;
    },
    resetUser: (state) => {
      state.name = '';
      state.role = '';
      state.hasAnswered = false;
      state.selectedAnswer = null;
    },
  },
});

export const {
  setUser,
  setConnected,
  setHasAnswered,
  setSelectedAnswer,
  resetUser,
} = userSlice.actions;

export default userSlice.reducer;