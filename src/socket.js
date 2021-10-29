const accessEnv = require('./helpers/accessEnv');

const ChatService = {
  users: [], // online users

  getUsers() {
    return this.users;
  },

  addUser(userId, convId, socketId) {
    // add new user if it doest exist already,
    // else, remove user if it exists and replace with same user(different convid or socketid)
    if (!this.users.some((user) => user.userId === userId)) {
      this.users.push({ userId, convId, socketId });
    } else {
      const arr = this.users.filter((user) => user.userId !== userId);
      arr.push({ userId, convId, socketId });
      this.users = arr;
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
  const CLIENT_URL = accessEnv('CLIENT_URL');
  // eslint-disable-next-line global-require
  const io = require('socket.io')(server, {
    cors: {
      origin: CLIENT_URL,
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
      // remove sender from the receivers list
      const receiversList = receivers.filter((r) => r.userId !== senderId);

      receiversList.forEach((receiver) => {
        io.to(receiver.socketId).emit('get-message', {
          convId,
          senderId,
          text,
        });
      });
    });

    socket.on('typing', ({ convId, senderId, receiversId, isTyping }) => {
      const receivers = ChatService.getRecipientUsers(receiversId);

      receivers.forEach((receiver) => {
        io.to(receiver.socketId).emit('display-typing', {
          convId,
          senderId,
          isTyping,
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
