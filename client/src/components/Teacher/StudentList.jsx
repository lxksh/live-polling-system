import React from "react";
import "./StudentList.css";

const StudentList = ({ students, onRemoveStudent }) => {
  return (
    <div className="student-list-container">
      <div className="student-list-header">
        <h2>Connected Students</h2>
        <p>Manage your students and monitor their participation</p>
      </div>

      <div className="students-grid">
        {students.length === 0 ? (
          <div className="no-students">
            <div className="empty-state">
              <div className="empty-icon">👥</div>
              <h3>No students connected</h3>
              <p>Students will appear here once they join the session</p>
            </div>
          </div>
        ) : (
          students.map((student) => (
            <div key={student.id} className="student-card">
              <div className="student-info">
                <div className="student-avatar">
                  {student.name.charAt(0).toUpperCase()}
                </div>
                <div className="student-details">
                  <h4>{student.name}</h4>
                  <p className="student-status">
                    {student.hasAnswered ? "✅ Answered" : "⏳ Waiting"}
                  </p>
                  <p className="join-time">
                    Joined: {new Date(student.joinedAt).toLocaleTimeString()}
                  </p>
                </div>
              </div>
              <button
                className="remove-student-btn"
                onClick={() => onRemoveStudent(student.id)}
                title="Remove student"
              >
                🗑️
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default StudentList;
