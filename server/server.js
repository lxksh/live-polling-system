const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

let currentPoll = null;
let students = new Map();
let answers = new Map();
let pollHistory = [];
let isQuestionActive = false;
let questionTimer = null;
let chatMessages = [];

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('student-join', (data) => {
    const { name } = data;
    students.set(socket.id, {
      id: socket.id,
      name: name,
      hasAnswered: false,
      joinedAt: new Date()
    });

    socket.emit('student-joined', { success: true });

    if (currentPoll && isQuestionActive) {
      socket.emit('question-started', {
        ...currentPoll,
        timeRemaining: currentPoll.timeLimit
      });
    } else if (currentPoll && !isQuestionActive) {
      socket.emit('show-results', calculateResults());
    } else {
      socket.emit('waiting-for-question');
    }

    io.emit('students-updated', Array.from(students.values()));
  });

  socket.on('create-poll', (pollData) => {
    currentPoll = {
      id: uuidv4(),
      question: pollData.question,
      options: pollData.options,
      timeLimit: pollData.timeLimit || 60,
      createdAt: new Date()
    };

    answers.clear();
    students.forEach(student => {
      student.hasAnswered = false;
    });

    isQuestionActive = true;

    io.emit('question-started', {
      ...currentPoll,
      timeRemaining: currentPoll.timeLimit
    });

    let timeRemaining = currentPoll.timeLimit;
    questionTimer = setInterval(() => {
      timeRemaining--;
      io.emit('timer-update', timeRemaining);

      if (timeRemaining <= 0) {
        endQuestion();
      }
    }, 1000);
  });

  socket.on('submit-answer', (data) => {
    if (currentPoll && isQuestionActive && students.has(socket.id)) {
      const student = students.get(socket.id);

      if (!student.hasAnswered) {
        answers.set(socket.id, {
          studentId: socket.id,
          studentName: student.name,
          answer: data.selectedOption,
          submittedAt: new Date()
        });

        student.hasAnswered = true;
        students.set(socket.id, student);

        socket.emit('answer-submitted');

        const totalStudents = students.size;
        const answeredCount = answers.size;

        if (answeredCount === totalStudents && totalStudents > 0) {
          endQuestion();
        }
      }
    }
  });

  socket.on('get-results', () => {
    if (currentPoll) {
      socket.emit('show-results', calculateResults());
    }
  });

  socket.on('get-poll-history', () => {
    socket.emit('poll-history', pollHistory);
  });

  socket.on('send-message', (messageData) => {
    const message = {
      id: uuidv4(),
      text: messageData.text,
      sender: messageData.sender,
      senderType: messageData.senderType,
      timestamp: new Date(),
      socketId: socket.id
    };

    chatMessages.push(message);
    io.emit('new-message', message);
  });

  socket.on('get-chat-history', () => {
    socket.emit('chat-history', chatMessages);
  });

  socket.on('clear-chat', () => {
    chatMessages = [];
    io.emit('chat-cleared');
  });

  socket.on('remove-student', (studentId) => {
    if (students.has(studentId)) {
      io.to(studentId).emit('student-removed');
      students.delete(studentId);
      answers.delete(studentId);
      io.emit('students-updated', Array.from(students.values()));
    }
  });

  socket.on('disconnect', () => {
    students.delete(socket.id);
    answers.delete(socket.id);
    io.emit('students-updated', Array.from(students.values()));
    console.log('User disconnected:', socket.id);
  });
});

function endQuestion() {
  if (questionTimer) {
    clearInterval(questionTimer);
    questionTimer = null;
  }

  isQuestionActive = false;

  const results = calculateResults();

  pollHistory.push({
    ...currentPoll,
    results: results,
    endedAt: new Date()
  });

  io.emit('question-ended');
  io.emit('show-results', results);
}

function calculateResults() {
  if (!currentPoll) return null;

  const results = {
    pollId: currentPoll.id,
    question: currentPoll.question,
    options: currentPoll.options.map(option => ({
      text: option,
      count: 0,
      percentage: 0
    })),
    totalVotes: answers.size,
    totalStudents: students.size,
    responses: Array.from(answers.values())
  };

  answers.forEach(answer => {
    const optionIndex = currentPoll.options.findIndex(opt => opt === answer.answer);
    if (optionIndex !== -1) {
      results.options[optionIndex].count++;
    }
  });

  if (results.totalVotes > 0) {
    results.options.forEach(option => {
      option.percentage = Math.round((option.count / results.totalVotes) * 100);
    });
  }

  return results;
}

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
