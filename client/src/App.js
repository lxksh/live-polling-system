import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store/store';
import { ThemeProvider } from './contexts/ThemeContext';
import Home from './components/Home/Home';
import Teacher from './components/Teacher/Teacher';
import Student from './components/Student/Student';
import ThemeToggle from './components/ThemeToggle/ThemeToggle';
import './App.css';

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <Router>
          <div className="App">
            <ThemeToggle />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/teacher" element={<Teacher />} />
              <Route path="/student" element={<Student />} />
            </Routes>
          </div>
        </Router>
      </ThemeProvider>
    </Provider>
  );
}

export default App;