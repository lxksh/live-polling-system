import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import socketService from "../../services/socketService";
import NameEntry from "./NameEntry";
import QuestionView from "./QuestionView";
import ResultsView from "./ResultsView";
import WaitingScreen from "./WaitingScreen";
import KickedOut from "./KickedOut";
import ChatButton from "../Chat/ChatButton";
import {
  setCurrentPoll,
  setResults,
  setTimeRemaining,
} from "../../store/slices/pollSlice";
import {
  setUser,
  setConnected,
  setHasAnswered,
} from "../../store/slices/userSlice";
import "./Student.css";

const Student = () => {
  const dispatch = useDispatch();
  const { currentPoll, results, timeRemaining } = useSelector(
    (state) => state.poll
  );
  const { name, isConnected, hasAnswered } = useSelector((state) => state.user);
  const [currentScreen, setCurrentScreen] = useState("name-entry");
  const [isKicked, setIsKicked] = useState(false);

  const connectToSocket = useCallback(() => {
    const socket = socketService.connect();

    socket.on("connect", () => {
      dispatch(setConnected(true));
      socketService.joinAsStudent(name);
    });

    socket.on("student-joined", (data) => {
      if (data.success) {
        setCurrentScreen("waiting");
        console.log("Successfully joined as student");
      }
    });
    
    socket.on("question-started", (pollData) => {
      dispatch(setCurrentPoll(pollData));
      dispatch(setTimeRemaining(pollData.timeRemaining));
      dispatch(setHasAnswered(false));
      setCurrentScreen("question");
    });

    socket.on("timer-update", (time) => {
      dispatch(setTimeRemaining(time));
    });

    socket.on("question-ended", () => {
      setCurrentScreen("waiting-results");
    });

    socket.on("show-results", (resultsData) => {
      dispatch(setResults(resultsData));
      setCurrentScreen("results");
    });

    socket.on("answer-submitted", () => {
      dispatch(setHasAnswered(true));
    });

    socket.on("waiting-for-question", () => {
      setCurrentScreen("waiting");
    });

    socket.on("student-removed", () => {
      setIsKicked(true);
      socketService.disconnect();
    });

    return () => {
      socketService.removeAllListeners();
    };
  }, [dispatch, name]);

  useEffect(() => {
    if (name && !isConnected) {
      connectToSocket();
    }
  }, [name, isConnected, connectToSocket]);

  const handleNameSubmit = (studentName) => {
    dispatch(setUser({ name: studentName, role: "student" }));
    setTimeout(() => {
      connectToSocket(); // manually trigger socket connection
    }, 0);
  };

  const handleAnswerSubmit = (selectedOption) => {
    socketService.submitAnswer(selectedOption);
  };

  if (isKicked) {
    return <KickedOut />;
  }

  return (
    <div className="student-container">
      <div className="student-content">
        {currentScreen === "name-entry" && (
          <NameEntry onSubmit={handleNameSubmit} />
        )}

        {currentScreen === "waiting" && <WaitingScreen />}

        {currentScreen === "question" && currentPoll && (
          <QuestionView
            poll={currentPoll}
            timeRemaining={timeRemaining}
            onSubmit={handleAnswerSubmit}
            hasAnswered={hasAnswered}
          />
        )}

        {currentScreen === "waiting-results" && (
          <div className="waiting-results">
            <div className="spinner"></div>
            <p>Waiting for results...</p>
          </div>
        )}

        {currentScreen === "results" && results && (
          <ResultsView results={results} />
        )}
      </div>

      {name && <ChatButton />}
    </div>
  );
};

export default Student;
