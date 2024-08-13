const http = require('http');
const socketIO = require('socket.io');

const app = require('./app');

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);
const io = socketIO(server, {
  pingTimeOut: 60000,
  cors: {
    origin: ['http://localhost:5173'], // Allow the frontend to connect
  },
});

io.on('connection', socket => {
  console.log('A user connected:', socket.id);

  // Listen for notification events
  socket.on('sendNotification', data => {
    console.log('notification data', data);
    // Emit the notification to the specific user by taskReceiverId
    socket.in(data?.receiverId).emit('receiveNotification', data);
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected:', socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = { io };
