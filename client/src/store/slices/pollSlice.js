import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentPoll: null,
  results: null,
  pollHistory: [],
  students: [],
  timeRemaining: 0,
  isQuestionActive: false,
  showResults: false,
};

const pollSlice = createSlice({
  name: 'poll',
  initialState,
  reducers: {
    setCurrentPoll: (state, action) => {
      state.currentPoll = action.payload;
      state.isQuestionActive = true;
      state.showResults = false;
    },
    setResults: (state, action) => {
      state.results = action.payload;
      state.showResults = true;
      state.isQuestionActive = false;
    },
    setStudents: (state, action) => {
      state.students = action.payload;
    },
    setTimeRemaining: (state, action) => {
      state.timeRemaining = action.payload;
    },
    setPollHistory: (state, action) => {
      state.pollHistory = action.payload;
    },
    endQuestion: (state) => {
      state.isQuestionActive = false;
    },
    resetPoll: (state) => {
      state.currentPoll = null;
      state.results = null;
      state.timeRemaining = 0;
      state.isQuestionActive = false;
      state.showResults = false;
    },
  },
});

export const {
  setCurrentPoll,
  setResults,
  setStudents,
  setTimeRemaining,
  setPollHistory,
  endQuestion,
  resetPoll,
} = pollSlice.actions;

export default pollSlice.reducer;