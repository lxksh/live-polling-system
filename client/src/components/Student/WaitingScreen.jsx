import React from "react";
import "./WaitingScreen.css";

const WaitingScreen = () => {
  return (
    <div className="waiting-screen-container">
      <div className="waiting-content">
        <div className="badge badge-primary">Intervue Poll</div>

        <div className="spinner-container">
          <div className="spinner-purple"></div>
        </div>

        <h2 className="waiting-title">
          Wait for the teacher to ask questions..
        </h2>
        <p className="waiting-subtitle">
          You'll be notified when a new question is available
        </p>
      </div>
    </div>
  );
};

export default WaitingScreen;
