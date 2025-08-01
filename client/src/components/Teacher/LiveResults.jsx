import React, { useState } from "react";
import "./LiveResults.css";

const LiveResults = ({ poll, results, onNewQuestion }) => {
  const [showHistory, setShowHistory] = useState(false);

  const getProgressBarClass = (index) => {
    const classes = ["first", "second", "third", "fourth"];
    return classes[index % classes.length];
  };

  const getOptionNumberClass = (index) => {
    const classes = ["first", "second", "third", "fourth"];
    return classes[index % classes.length];
  };

  if (!results) {
    return (
      <div className="live-results-container">
        <div className="results-header">
          <h2>Question</h2>
          <div className="question-box">{poll?.question}</div>
        </div>

        <div className="waiting-message">
          <div className="spinner"></div>
          <p>Waiting for student responses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="live-results-container">
      <button
        className="btn btn-primary view-history-btn"
        onClick={() => setShowHistory(true)}
      >
        👁️ View Poll history
      </button>

      <div className="results-content">
        <div className="question-section">
          <h2 className="section-title">Question</h2>
          <div className="question-box">{results.question}</div>

          <div className="results-container">
            {results.options.map((option, index) => (
              <div key={index} className="result-item">
                <div className="result-option">
                  <div
                    className={`option-number ${getOptionNumberClass(index)}`}
                  >
                    {index + 1}
                  </div>
                  <span className="option-text">{option.text}</span>
                </div>
                <div className="progress-container">
                  <div className="progress-bar">
                    <div
                      className={`progress-fill ${getProgressBarClass(index)}`}
                      style={{ width: `${option.percentage}%` }}
                    ></div>
                  </div>
                  <span className="percentage">{option.percentage}%</span>
                </div>
              </div>
            ))}
          </div>

          <div className="results-actions">
            <button
              className="btn btn-primary new-question-btn"
              onClick={onNewQuestion}
            >
              + Ask a new question
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveResults;
