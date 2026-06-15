const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000", "http://localhost:3001"],
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

app.use('/api/auth', require('./routes/auth'));

require('./socket')(io);

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected ✓'))
  .catch(err => console.log(err));

server.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});