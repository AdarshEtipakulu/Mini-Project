const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Message = require('../models/Message');

module.exports = (io) => {
  
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.user = await User.findById(decoded.id).select('-password');
      next();
    } catch (err) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`${socket.user.username} connected`);

    socket.on('join_room', async (room) => {
      socket.join(room);
      socket.currentRoom = room;
      
      const messages = await Message.find({ room, isDeleted: false })
        .populate('sender', 'username role')
        .sort({ createdAt: -1 })
        .limit(50);
      
      socket.emit('message_history', messages.reverse());
      
      socket.to(room).emit('user_joined', {
        username: socket.user.username,
        message: `${socket.user.username} joined the room`
      });
    });

    socket.on('send_message', async (data) => {
      const { content, room } = data;
      
      const message = await Message.create({
        content,
        sender: socket.user._id,
        room
      });
      
      await message.populate('sender', 'username role');
      
      io.to(room).emit('receive_message', {
        _id: message._id,
        content: message.content,
        sender: {
          username: message.sender.username,
          role: message.sender.role
        },
        createdAt: message.createdAt
      });
    });

    socket.on('delete_message', async (messageId) => {
      const user = socket.user;
      if (user.role === 'user') {
        socket.emit('error', { message: 'Permission denied' });
        return;
      }
      
      await Message.findByIdAndUpdate(messageId, { isDeleted: true });
      io.to(socket.currentRoom).emit('message_deleted', { messageId });
    });

    socket.on('typing', (room) => {
      socket.to(room).emit('user_typing', { username: socket.user.username });
    });

    socket.on('stop_typing', (room) => {
      socket.to(room).emit('user_stop_typing', { username: socket.user.username });
    });

    socket.on('disconnect', () => {
      console.log(`${socket.user.username} disconnected`);
      if (socket.currentRoom) {
        socket.to(socket.currentRoom).emit('user_left', {
          username: socket.user.username
        });
      }
    });
  });
};