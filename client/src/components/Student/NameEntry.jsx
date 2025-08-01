import React, { useState } from "react";
import "./NameEntry.css";

const NameEntry = ({ onSubmit }) => {
  const [name, setName] = useState("");
  const [showSuggestion, setShowSuggestion] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      onSubmit(name.trim());
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setName(value);
    setShowSuggestion(
      value.length > 0 && value.toLowerCase().includes("rahul")
    );
  };

  const selectSuggestion = (suggestion) => {
    setName(suggestion);
    setShowSuggestion(false);
  };

  return (
    <div className="name-entry-container">
      <div className="name-entry-content">
        <div className="badge badge-primary">Intervue Poll</div>

        <h1 className="name-entry-title">Let's Get Started</h1>
        <p className="name-entry-description">
          If you're a student, you'll be able to{" "}
          <strong>submit your answers</strong>, participate in live polls, and
          see how your responses compare with your classmates
        </p>

        <form onSubmit={handleSubmit} className="name-form">
          <div className="form-group">
            <label htmlFor="name" className="form-label">
              Enter your Name
            </label>
            <div style={{ position: "relative" }}>
              <input
                id="name"
                type="text"
                value={name}
                onChange={handleInputChange}
                placeholder="Enter your name"
                className="name-input"
                autoFocus
              />
              {showSuggestion && (
                <div className="input-suggestions">
                  <div
                    className="suggestion-item"
                    onClick={() => selectSuggestion("Haritha Manoj")}
                  >
                    Haritha Manoj
                  </div>
                </div>
              )}
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary continue-btn"
            disabled={!name.trim()}
          >
            Continue
          </button>
        </form>
      </div>
    </div>
  );
};

export default NameEntry;
