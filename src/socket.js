const ChatService = {
  users: [],

  getUsers() {
    return this.users;
  },

  addUser(userId, convId, socketId) {
    if (!this.users.some((user) => user.userId === userId)) {
      this.users.push({ userId, convId, socketId });
    }
  },

  removeUser(socketId) {
    this.users = this.users.filter((user) => user.socketId !== socketId);
  },

  getRecipientUsers(receiversId) {
    return this.users.filter((user) => receiversId?.includes(user.userId));
  },
};

function runSocket(server) {
  // eslint-disable-next-line global-require
  const io = require('socket.io')(server, {
    cors: {
      origin: process.env.CLIENT_URL,
    },
  });

  io.on('connection', (socket) => {
    socket.on('add-user', (userId, convId) => {
      ChatService.addUser(userId, convId, socket.id);
      io.emit('get-users', ChatService.getUsers());
    });

    /* Messaging */
    socket.on('send-message', ({ convId, senderId, receiversId, text }) => {
      const receivers = ChatService.getRecipientUsers(receiversId);

      receivers.forEach((receiver) => {
        io.to(receiver.socketId).emit('get-message', {
          convId,
          senderId,
          text,
        });
      });
    });

    socket.on('disconnect', () => {
      ChatService.removeUser(socket.id);
      io.emit('get-users', ChatService.getUsers());
    });
  });
}

module.exports = runSocket;
