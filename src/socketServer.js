const socketIO = require('socket.io');

const initializeSocket = (server) => {
  const io = socketIO(server);

  io.on('connection', (socket) => {
    console.log('User connected');

    socket.on('join', ({ username, userType }) => {
      console.log(`${userType} ${username} joined the chat`);
      socket.join(userType);
    });

    socket.on('disconnect', () => {
      console.log('User disconnected');
    });

    socket.on('chat message', (msg) => {
      console.log('Received message:', msg);
      io.to(msg.userType).emit('chat message', msg);
    });
  });

  return io;
};

module.exports = { initializeSocket };
