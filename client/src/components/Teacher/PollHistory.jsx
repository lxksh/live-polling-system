import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import "./PollHistory.css";

const PollHistory = ({ onClose }) => {
  const { pollHistory } = useSelector((state) => state.poll);

  const getProgressBarColor = (index) => {
    const colors = [
      "#7765DA",
      "#5767CD",
      "#4F00CE",
      "#8E7BDA",
      "#9B8CE8",
      "#A89BF0",
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="poll-history-overlay">
      <div className="poll-history-container">
        <div className="poll-history-header">
          <h2>View Poll History</h2>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="poll-history-content">
          {pollHistory.length === 0 ? (
            <div className="no-history">
              <p>No poll history available yet.</p>
            </div>
          ) : (
            pollHistory.map((poll, pollIndex) => (
              <div key={poll.id} className="history-item">
                <div className="history-header">
                  <h3>Question {pollIndex + 1}</h3>
                  <span className="poll-date">
                    {new Date(poll.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <div className="history-question">{poll.question}</div>

                <div className="history-results">
                  {poll.results.options.map((option, index) => (
                    <div key={index} className="history-result-item">
                      <div className="result-option">
                        <div
                          className="option-indicator"
                          style={{
                            backgroundColor: getProgressBarColor(index),
                          }}
                        ></div>
                        <span className="option-text">{option.text}</span>
                      </div>
                      <div className="result-bar-container">
                        <div
                          className="result-bar"
                          style={{
                            width: `${option.percentage}%`,
                            backgroundColor: getProgressBarColor(index),
                          }}
                        ></div>
                        <span className="percentage">{option.percentage}%</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="history-stats">
                  <span>Total votes: {poll.results.totalVotes}</span>
                  <span>Participants: {poll.results.totalStudents}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default PollHistory;
