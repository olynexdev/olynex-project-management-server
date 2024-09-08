const https = require('https');
const socketIO = require('socket.io');
require('dotenv').config();
const app = require('./app');
const path = require('path');
const fs = require('fs');
const initializeZKLib = require('./services/zklibInstance');
const scheduleAttendanceCheck = require('./services/postAbsent.corn');
const schedulePendingTaskCheck = require('./services/postPendingTaskNotification.corn');

const PORT = process.env.PORT || 5000;

const keyPath = path.join(__dirname, 'cert', 'server.key');
const certPath = path.join(__dirname, 'cert', 'server.crt');

const server = https.createServer(
  {
    key: fs.readFileSync(keyPath),
    cert: fs.readFileSync(certPath),
  },
  app
);

const io = socketIO(server, {
  pingTimeout: 60000,
  cors: {
    origin: ['http://localhost:5173', "https://olynex.online"],
    credentials: true,
  },
});

io.on('connection', socket => {
  console.log('A user connected:', socket.id);

  // Handle user joining a room based on their ID
  socket.on('joinRoom', userId => {
    socket.join(userId);
    console.log(`User ${socket.id} joined room ${userId}`);
  });

  // Listen for notification events
  socket.on('sendNotification', data => {
    console.log('Notification data:', data);
    // Emit the notification to the specific user by receiverId
    io.to(data.receiverId).emit('receiveNotification', data);
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected:', socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  initializeZKLib();
  scheduleAttendanceCheck();
  schedulePendingTaskCheck(io);
});

module.exports = { io };
