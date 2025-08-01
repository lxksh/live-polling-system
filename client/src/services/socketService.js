import io from 'socket.io-client';

class SocketService {
  constructor() {
    this.socket = null;
    this.serverUrl = process.env.REACT_APP_SERVER_URL || 'http://localhost:5000';
  }

  connect() {
    if (!this.socket) {
      this.socket = io(this.serverUrl);
    }
    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  joinAsStudent(name) {
    this.socket?.emit('student-join', { name });
  }

  submitAnswer(selectedOption) {
    this.socket?.emit('submit-answer', { selectedOption });
  }

  createPoll(pollData) {
    this.socket?.emit('create-poll', pollData);
  }

  removeStudent(studentId) {
    this.socket?.emit('remove-student', studentId);
  }

  getPollHistory() {
    this.socket?.emit('get-poll-history');
  }

  sendMessage(messageData) {
    this.socket?.emit('send-message', messageData);
  }

  getChatHistory() {
    this.socket?.emit('get-chat-history');
  }

  clearChat() {
    this.socket?.emit('clear-chat');
  }

  onStudentJoined(callback) {
    this.socket?.on('student-joined', callback);
  }

  onQuestionStarted(callback) {
    this.socket?.on('question-started', callback);
  }

  onTimerUpdate(callback) {
    this.socket?.on('timer-update', callback);
  }

  onQuestionEnded(callback) {
    this.socket?.on('question-ended', callback);
  }

  onShowResults(callback) {
    this.socket?.on('show-results', callback);
  }

  onAnswerSubmitted(callback) {
    this.socket?.on('answer-submitted', callback);
  }

  onWaitingForQuestion(callback) {
    this.socket?.on('waiting-for-question', callback);
  }

  onStudentsUpdated(callback) {
    this.socket?.on('students-updated', callback);
  }

  onPollHistory(callback) {
    this.socket?.on('poll-history', callback);
  }

  onStudentRemoved(callback) {
    this.socket?.on('student-removed', callback);
  }

  onNewMessage(callback) {
    this.socket?.on('new-message', callback);
  }

  onChatHistory(callback) {
    this.socket?.on('chat-history', callback);
  }

  onChatCleared(callback) {
    this.socket?.on('chat-cleared', callback);
  }

  removeAllListeners() {
    this.socket?.removeAllListeners();
  }
}

const socketServiceInstance = new SocketService();
export default socketServiceInstance;