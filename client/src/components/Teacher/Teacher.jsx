import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import socketService from "../../services/socketService";
import CreatePoll from "./CreatePoll";
import LiveResults from "./LiveResults";
import PollHistory from "./PollHistory";
import StudentList from "./StudentList";
import ChatButton from "../Chat/ChatButton";

import {
  setCurrentPoll,
  setResults,
  setStudents,
  setPollHistory,
} from "../../store/slices/pollSlice";
import { setUser, setConnected } from "../../store/slices/userSlice";
import "./Teacher.css";

const Teacher = () => {
  const dispatch = useDispatch();
  const { currentPoll, results, students, showResults } = useSelector(
    (state) => state.poll
  );
  const { isConnected } = useSelector((state) => state.user);
  const [activeTab, setActiveTab] = useState("create");
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    const socket = socketService.connect();
    dispatch(setUser({ name: "Teacher", role: "teacher" }));
    dispatch(setConnected(true));

    socket.on("connect", () => {
      dispatch(setConnected(true));
    });

    socket.on("students-updated", (studentsList) => {
      dispatch(setStudents(studentsList));
    });

    socket.on("show-results", (resultsData) => {
      dispatch(setResults(resultsData));
      setActiveTab("results");
    });

    socket.on("poll-history", (history) => {
      dispatch(setPollHistory(history));
    });

    return () => {
      socketService.removeAllListeners();
    };
  }, [dispatch]);

  const handleCreatePoll = (pollData) => {
    socketService.createPoll(pollData);
    dispatch(setCurrentPoll(pollData));
    setActiveTab("results");
  };

  const handleRemoveStudent = (studentId) => {
    socketService.removeStudent(studentId);
  };

  const handleViewHistory = () => {
    socketService.getPollHistory();
    setShowHistory(true);
  };

  if (!isConnected) {
    return (
      <div className="teacher-container">
        <div className="loading">Connecting to server...</div>
      </div>
    );
  }

  return (
    <div className="teacher-container">
      <header className="teacher-header">
        <div className="badge badge-primary">intervue.io</div>
        <h1>Teacher Dashboard</h1>
        <div className="student-count">
          Students Connected: <span>{students.length}</span>
        </div>
      </header>

      <div className="teacher-content">
        <div className="teacher-nav">
          <button
            className={`nav-btn ${activeTab === "create" ? "active" : ""}`}
            onClick={() => setActiveTab("create")}
            disabled={currentPoll && !showResults}
          >
            Create Poll
          </button>
          <button
            className={`nav-btn ${activeTab === "results" ? "active" : ""}`}
            onClick={() => setActiveTab("results")}
            disabled={!currentPoll}
          >
            Live Results
          </button>
          <button
            className={`nav-btn ${activeTab === "students" ? "active" : ""}`}
            onClick={() => setActiveTab("students")}
          >
            Students ({students.length})
          </button>
          <button className={`nav-btn history-btn`} onClick={handleViewHistory}>
            📊 View Poll History
          </button>
        </div>

        <div className="teacher-main">
          {activeTab === "create" && (
            <CreatePoll
              onCreatePoll={handleCreatePoll}
              disabled={currentPoll && !showResults}
            />
          )}

          {activeTab === "results" && currentPoll && (
            <LiveResults
              poll={currentPoll}
              results={results}
              onNewQuestion={() => setActiveTab("create")}
            />
          )}

          {activeTab === "students" && (
            <StudentList
              students={students}
              onRemoveStudent={handleRemoveStudent}
            />
          )}
        </div>
      </div>

          {showHistory && <PollHistory onClose={() => setShowHistory(false)} />}
          <ChatButton />
    </div>
  );
};

export default Teacher;
