import React, { useState } from "react";
import "./CreatePoll.css";

const CreatePoll = ({ onCreatePoll, disabled }) => {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const [timeLimit, setTimeLimit] = useState(60);

  const handleAddOption = () => {
    if (options.length < 6) {
      setOptions([...options, ""]);
    }
  };

  const handleRemoveOption = (index) => {
    if (options.length > 2) {
      const newOptions = options.filter((_, i) => i !== index);
      setOptions(newOptions);
    }
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (question.trim() && options.every((opt) => opt.trim())) {
      onCreatePoll({
        question: question.trim(),
        options: options.filter((opt) => opt.trim()),
        timeLimit,
      });
      setQuestion("");
      setOptions(["", ""]);
      setTimeLimit(60);
    }
  };

  const isValid =
    question.trim() &&
    options.every((opt) => opt.trim()) &&
    options.filter((opt) => opt.trim()).length >= 2;

  return (
    <div className="create-poll-container">
      <div className="create-poll-header">
        <div className="badge badge-primary">Intervue Poll</div>
        <h2 className="create-poll-title">Let's Get Started</h2>
        <p className="create-poll-description">
          you'll have the ability to create and manage polls, ask questions, and
          monitor your students' responses in real-time.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="poll-form">
        <div className="form-section">
          <label className="section-title">Enter your question</label>
          <div className="question-input-row">
            <div className="question-input-group">
              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="What is your question?"
                className="question-textarea"
                disabled={disabled}
                maxLength={500}
              />
              <div className="char-counter">{question.length}/500</div>
            </div>
            <div className="time-selector">
              <div className="time-display">{timeLimit} seconds ⏱️</div>
              <input
                type="range"
                min="30"
                max="120"
                value={timeLimit}
                onChange={(e) => setTimeLimit(parseInt(e.target.value))}
                disabled={disabled}
                className="time-slider"
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <div className="options-section">
            <label className="section-title">Edit Options</label>
            <div className="options-grid">
              {options.map((option, index) => (
                <div key={index} className="option-input-group">
                  <div className="option-number">{index + 1}</div>
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    placeholder={`Option ${index + 1}`}
                    className="option-input"
                    disabled={disabled}
                  />
                  <div className="correctness-toggle">
                    <label>
                      <input
                        type="radio"
                        name={`correct-${index}`}
                        disabled={disabled}
                      />
                      Yes
                    </label>
                    <label>
                      <input
                        type="radio"
                        name={`correct-${index}`}
                        disabled={disabled}
                      />
                      No
                    </label>
                  </div>
                  {options.length > 2 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveOption(index)}
                      className="remove-option-btn"
                      disabled={disabled}
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
              {options.length < 6 && (
                <button
                  type="button"
                  onClick={handleAddOption}
                  className="add-option-btn"
                  disabled={disabled}
                >
                  + Add More option
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="submit-section">
          <button
            type="submit"
            className="btn btn-primary ask-question-btn"
            disabled={!isValid || disabled}
          >
            Ask Question
          </button>
        </div>
      </form>

      {disabled && (
        <div className="disabled-message">
          <p>
            Please wait for the current question to end before creating a new
            one.
          </p>
        </div>
      )}
    </div>
  );
};

export default CreatePoll;
