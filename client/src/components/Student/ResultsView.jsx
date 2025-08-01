import React from "react";
import "./ResultsView.css";

const ResultsView = ({ results }) => {
  const getProgressBarClass = (index) => {
    const classes = ["first", "second", "third", "fourth"];
    return classes[index % classes.length];
  };

  const getOptionNumberClass = (index) => {
    const classes = ["first", "second", "third", "fourth"];
    return classes[index % classes.length];
  };

  return (
    <div className="results-view-container">
      <div className="results-content">
        <div className="results-info">
          <span className="question-number">Question 1</span>
          <div className="timer completed">⏱️ 00:15</div>
        </div>

        <div className="question-box">{results.question}</div>

        <div className="results-container">
          {results.options.map((option, index) => (
            <div key={index} className="result-item">
              <div className="result-option">
                <div className={`option-number ${getOptionNumberClass(index)}`}>
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

        <div className="wait-message">
          <h3>Wait for the teacher to ask a new question.</h3>
        </div>
      </div>
    </div>
  );
};

export default ResultsView;
