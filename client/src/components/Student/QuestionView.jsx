import React, { useState, useEffect } from "react";
import "./QuestionView.css";

const QuestionView = ({ poll, timeRemaining, onSubmit, hasAnswered }) => {
  const [selectedOption, setSelectedOption] = useState("");
  const [timeColor, setTimeColor] = useState("normal");

  useEffect(() => {
    if (timeRemaining <= 10) {
      setTimeColor("danger");
    } else if (timeRemaining <= 30) {
      setTimeColor("warning");
    } else {
      setTimeColor("normal");
    }
  }, [timeRemaining]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedOption && !hasAnswered) {
      onSubmit(selectedOption);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div className="question-view-container">
      <div className="question-content">
        <div className="question-info">
          <span className="question-number">Question 1</span>
          <div className={`timer ${timeColor}`}>
            ⏱️ {formatTime(timeRemaining)}
          </div>
        </div>

        <div className="question-box">{poll.question}</div>

        <div className="options-container">
          {poll.options.map((option, index) => (
            <label
              key={index}
              className={`option-item ${
                selectedOption === option ? "selected" : ""
              } ${hasAnswered ? "disabled" : ""}`}
            >
              <input
                type="radio"
                name="answer"
                value={option}
                checked={selectedOption === option}
                onChange={(e) => setSelectedOption(e.target.value)}
                disabled={hasAnswered}
                style={{ display: "none" }}
              />
              <div
                className={`option-number ${
                  index === 0
                    ? "first"
                    : index === 1
                    ? "second"
                    : index === 2
                    ? "third"
                    : "fourth"
                }`}
              >
                {index + 1}
              </div>
              <span className="option-text">{option}</span>
            </label>
          ))}
        </div>

        {!hasAnswered ? (
          <div className="submit-section">
            <button
              type="submit"
              className="btn btn-primary submit-btn"
              onClick={handleSubmit}
              disabled={!selectedOption || timeRemaining <= 0}
            >
              Submit
            </button>
          </div>
        ) : (
          <div className="submitted-message">
            <div className="success-icon">✓</div>
            <h3>Your answer has been submitted!</h3>
            <p>Please wait for other students to finish.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestionView;
