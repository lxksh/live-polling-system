import React from "react";
import "./KickedOut.css";

const KickedOut = () => {
  return (
    <div className="kicked-out-container">
      <div className="kicked-out-content">
        <div className="badge badge-primary">intervue.io</div>

        <h1>You've been Kicked out !</h1>
        <p>
          Looks like the teacher has removed you from the poll system. Please
          try again later maybe.
        </p>
      </div>
    </div>
  );
};

export default KickedOut;
