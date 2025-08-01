import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";

const Home = () => {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState("");

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
  };

  const handleContinue = () => {
    if (selectedRole === "student") {
      navigate("/student");
    } else if (selectedRole === "teacher") {
      navigate("/teacher");
    }
  };

  return (
    <div className="home-container">
      <div className="home-content">
        <div className="badge badge-primary">Intervue Poll</div>

        <h1>Welcome to the Live Polling System</h1>
        <p>
          Please select the role that best describes you to begin using the live
          polling system
        </p>

        <div className="role-selection">
          <div
            className={`role-card ${
              selectedRole === "student" ? "selected" : ""
            }`}
            onClick={() => handleRoleSelect("student")}
          >
            <div className="role-header">
              <h3>I'm a Student</h3>
              <p>
                Join the live poll, submit answers, and view results in real-time.
              </p>
            </div>
          </div>

          <div
            className={`role-card ${
              selectedRole === "teacher" ? "selected" : ""
            }`}
            onClick={() => handleRoleSelect("teacher")}
          >
            <div className="role-header">
              <h3>I'm a Teacher</h3>
              <p>Submit answers and view live poll results in real-time.</p>
            </div>
          </div>
        </div>

        <button
          className="btn btn-primary"
          onClick={handleContinue}
          disabled={!selectedRole}
          style={{ marginTop: "40px", minWidth: "200px", padding: "16px 40px" }}
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default Home;
