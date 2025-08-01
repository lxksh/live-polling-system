import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import socketService from "../../services/socketService";
import "./ChatPopup.css";

const ChatPopup = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef(null);
  const { name, role } = useSelector((state) => state.user);

  useEffect(() => {
    if (isOpen) {
      socketService.getChatHistory();
      socketService.onNewMessage((message) => {
        setMessages((prev) => [...prev, message]);
      });
      socketService.onChatHistory((history) => {
        setMessages(history);
      });
      socketService.onChatCleared(() => {
        setMessages([]);
      });
    }

    return () => {
      socketService.socket?.off("new-message");
      socketService.socket?.off("chat-history");
      socketService.socket?.off("chat-cleared");
    };
  }, [isOpen]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() && name) {
      socketService.sendMessage({
        text: newMessage.trim(),
        sender: name,
        senderType: role,
      });
      setNewMessage("");
    }
  };

  const handleClearChat = () => {
    if (role === "teacher") {
      socketService.clearChat();
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!isOpen) return null;

  return (
    <div className={`chat-popup ${isMinimized ? "minimized" : ""}`}>
      <div className="chat-header">
        <div className="chat-title">
          <span className="chat-icon">💬</span>
          <h3>Live Chat</h3>
          <span className="online-indicator">{messages.length} messages</span>
        </div>
        <div className="chat-controls">
          <button
            className="minimize-btn"
            onClick={() => setIsMinimized(!isMinimized)}
          >
            {isMinimized ? "□" : "_"}
          </button>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          <div className="chat-messages">
            {messages.length === 0 ? (
              <div className="no-messages">
                <p>No messages yet. Start the conversation!</p>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`message ${message.senderType} ${
                    message.sender === name ? "own-message" : ""
                  }`}
                >
                  <div className="message-header">
                    <span className="sender-name">
                      {message.sender}
                      {message.senderType === "teacher" && " 👨‍🏫"}
                    </span>
                    <span className="message-time">
                      {formatTime(message.timestamp)}
                    </span>
                  </div>
                  <div className="message-text">{message.text}</div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="chat-actions">
            {role === "teacher" && messages.length > 0 && (
              <button
                className="clear-chat-btn"
                onClick={handleClearChat}
                title="Clear all messages"
              >
                🗑️ Clear Chat
              </button>
            )}
          </div>

          <form className="chat-input-form" onSubmit={handleSendMessage}>
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="chat-input"
              maxLength={500}
            />
            <button
              type="submit"
              className="send-btn"
              disabled={!newMessage.trim()}
            >
              Send
            </button>
          </form>
        </>
      )}
    </div>
  );
};

export default ChatPopup;
