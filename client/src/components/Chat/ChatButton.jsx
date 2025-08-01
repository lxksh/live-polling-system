import React, { useState, useEffect } from "react";
import ChatPopup from "./ChatPopup";
import socketService from "../../services/socketService";
import "./ChatButton.css";

const ChatButton = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [hasNewMessage, setHasNewMessage] = useState(false);

  useEffect(() => {
    socketService.onNewMessage((message) => {
      if (!isChatOpen) {
        setUnreadCount((prev) => prev + 1);
        setHasNewMessage(true);
        if (Notification.permission === "granted") {
          new Notification(`New message from ${message.sender}`, {
            body: message.text,
            icon: "/favicon.ico",
          });
        }
      }
    });

    return () => {
      socketService.socket?.off("new-message");
    };
  }, [isChatOpen]);

  const handleChatToggle = () => {
    setIsChatOpen(!isChatOpen);
    if (!isChatOpen) {
      setUnreadCount(0);
      setHasNewMessage(false);
    }
  };

  const requestNotificationPermission = () => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  };

  useEffect(() => {
    requestNotificationPermission();
  }, []);

  return (
    <>
      <button
        className={`chat-float-btn ${hasNewMessage ? "has-notification" : ""}`}
        onClick={handleChatToggle}
        title="Open Chat"
      >
        💬
        {unreadCount > 0 && (
          <span className="notification-badge">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
        {hasNewMessage && <div className="pulse-animation"></div>}
      </button>

      <ChatPopup isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </>
  );
};

export default ChatButton;
