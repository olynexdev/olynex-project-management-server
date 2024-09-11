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

  // Use 'once' for events to avoid multiple event listener issues
  socket.once('disconnect', () => {
    console.log('A user disconnected:', socket.id);
    socket.removeAllListeners(); // Clean up listeners
  });

  // Handle user joining a room based on their ID
  socket.on('joinRoom', userId => {
    socket.join(userId);
    console.log(`User ${socket.id} joined room ${userId}`);
  });

  // Listen for notification events
  socket.on('sendNotification', data => {
    console.log('Notification data:', data);
    io.to(data.receiverId).emit('receiveNotification', data);
  });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  initializeZKLib();
  scheduleAttendanceCheck();
  schedulePendingTaskCheck(io);
});

module.exports = { io };
