import React, { useState } from "react";
import "./ChatPanel.css";

const ChatParticipantsPanel = ({
  participants = [],
  chatMessages = [],
  onKickOut,
  isTeacher = false,
}) => {
  const [activeTab, setActiveTab] = useState("participants");

  return (
    <div className="chat-participants-panel">
      <div className="panel-tabs">
        <button
          className={`tab-button ${activeTab === "chat" ? "active" : ""}`}
          onClick={() => setActiveTab("chat")}
        >
          Chat
        </button>
        <button
          className={`tab-button ${
            activeTab === "participants" ? "active" : ""
          }`}
          onClick={() => setActiveTab("participants")}
        >
          Participants
        </button>
      </div>

      <div className="panel-content">
        {activeTab === "participants" && <div className="participants-list" />}
        {activeTab === "chat" && <div className="chat-messages" />}
      </div>
    </div>
  );
};

export default ChatParticipantsPanel;
