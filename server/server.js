const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
const server = http.createServer(app);

// CORS configuration for production
const corsOptions = {
  origin: [
    "http://localhost:3000",
    "https://your-frontend-app.vercel.app", // Replace with your actual Vercel URL
    /\.vercel\.app$/
  ],
  methods: ["GET", "POST"],
  credentials: true
};

const io = socketIo(server, {
  cors: corsOptions,
  transports: ['websocket', 'polling'], // Add polling as fallback
  allowEIO3: true
});

app.use(cors(corsOptions));
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'Server is running', timestamp: new Date().toISOString() });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({ message: 'Live Polling Server is running!' });
});

// In-memory storage
let currentPoll = null;
let students = new Map();
let answers = new Map();
let pollHistory = [];
let isQuestionActive = false;
let questionTimer = null;
let chatMessages = [];

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Student joins with name
  socket.on('student-join', (data) => {
    console.log('Student joining:', data);
    const { name } = data;
    
    if (!name || !name.trim()) {
      socket.emit('student-joined', { success: false, error: 'Name is required' });
      return;
    }

    students.set(socket.id, {
      id: socket.id,
      name: name.trim(),
      hasAnswered: false,
      joinedAt: new Date()
    });
    
    console.log('Student joined successfully:', name);
    socket.emit('student-joined', { success: true, name: name.trim() });
    
    // Send current question if active
    if (currentPoll && isQuestionActive) {
      socket.emit('question-started', {
        ...currentPoll,
        timeRemaining: currentPoll.timeLimit
      });
    } else if (currentPoll && !isQuestionActive) {
      // Send results if question ended
      socket.emit('show-results', calculateResults());
    } else {
      socket.emit('waiting-for-question');
    }

    // Update teacher with student count
    io.emit('students-updated', Array.from(students.values()));
  });

  // Teacher creates new poll
  socket.on('create-poll', (pollData) => {
    console.log('Creating poll:', pollData);
    
    currentPoll = {
      id: uuidv4(),
      question: pollData.question,
      options: pollData.options,
      timeLimit: pollData.timeLimit || 60,
      createdAt: new Date()
    };
    
    // Reset for new question
    answers.clear();
    students.forEach(student => {
      student.hasAnswered = false;
    });
    
    isQuestionActive = true;
    
    // Broadcast question to all students
    io.emit('question-started', {
      ...currentPoll,
      timeRemaining: currentPoll.timeLimit
    });
    
    // Start countdown timer
    let timeRemaining = currentPoll.timeLimit;
    questionTimer = setInterval(() => {
      timeRemaining--;
      io.emit('timer-update', timeRemaining);
      
      if (timeRemaining <= 0) {
        endQuestion();
      }
    }, 1000);
  });

  // Student submits answer
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
        
        // Check if all students answered
        const totalStudents = students.size;
        const answeredCount = answers.size;
        
        if (answeredCount === totalStudents && totalStudents > 0) {
          endQuestion();
        }
      }
    }
  });

  // Chat functionality
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

  // Get current results
  socket.on('get-results', () => {
    if (currentPoll) {
      socket.emit('show-results', calculateResults());
    }
  });

  // Get poll history
  socket.on('get-poll-history', () => {
    socket.emit('poll-history', pollHistory);
  });

  // Remove student (teacher action)
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
  
  // Add to history
  pollHistory.push({
    ...currentPoll,
    results: results,
    endedAt: new Date()
  });
  
  // Send results to everyone
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
  
  // Count votes for each option
  answers.forEach(answer => {
    const optionIndex = currentPoll.options.findIndex(opt => opt === answer.answer);
    if (optionIndex !== -1) {
      results.options[optionIndex].count++;
    }
  });
  
  // Calculate percentages
  if (results.totalVotes > 0) {
    results.options.forEach(option => {
      option.percentage = Math.round((option.count / results.totalVotes) * 100);
    });
  }
  
  return results;
}

const PORT = process.env.PORT || 5000;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});