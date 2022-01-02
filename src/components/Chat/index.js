const socketEvents = (io) => {
  const clients = 0;
  const users = [];
  let names;

  function getConnectedPeople() {
    names = Object.values(users);
    console.log(names);
    return names;
  }

  io.on('connection', (socket) => {
    socket.on('new-user', (name) => {
      users[socket.id] = name;
      socket.broadcast.emit('new-user-message', name);
      socket.broadcast.emit('users-list', getConnectedPeople());
      socket.emit('users-list', names);
      console.log(`${name} joined the chat!`);
    });

    socket.on('send-chat-message', (message) => {
      socket.broadcast.emit('chat-message', {
        message,
        name: users[socket.id],
      });
    });

    socket.on('user-typing', (username) => {
      socket.broadcast.emit('user-typing', username);
    });

    socket.on('disconnect', () => {
      if (users[socket.id] !== undefined && users[socket.id] !== null) {
        socket.broadcast.emit('disconnect-message', users[socket.id]);
      }
      console.log(`${users[socket.id]} left the chat!`);
      delete users[socket.id];
      socket.broadcast.emit('users-list', getConnectedPeople());
    });
  });
};

module.exports = socketEvents;
