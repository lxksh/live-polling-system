import React, { useState, useEffect } from "react";
import socketService from "../../services/socketService";
import "./ChatStats.css";

const ChatStats = () => {
  const [messageCount, setMessageCount] = useState(0);
  const [activeUsers, setActiveUsers] = useState(0);

  useEffect(() => {
    socketService.onNewMessage(() => {
      setMessageCount((prev) => prev + 1);
    });

    socketService.onChatCleared(() => {
      setMessageCount(0);
    });

    return () => {
      socketService.socket?.off("new-message");
      socketService.socket?.off("chat-cleared");
    };
  }, []);

  return (
    <div className="chat-stats">
      <div className="stat-item">
        <span className="stat-label">Messages:</span>
        <span className="stat-value">{messageCount}</span>
      </div>
    </div>
  );
};

export default ChatStats;
