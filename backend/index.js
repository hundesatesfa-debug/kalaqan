const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const { Server } = require('socket.io');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Add io to req object
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Routes (register both clean path and proxy-prefixed paths for maximum robustness)
const registerRoutes = (prefix = '') => {
  app.use(`${prefix}/api/auth`, require('./routes/auth'));
  app.use(`${prefix}/api/applicants`, require('./routes/applicants'));
  app.use(`${prefix}/api/events`, require('./routes/events'));
  app.use(`${prefix}/api/stats`, require('./routes/stats'));
};

registerRoutes('');
registerRoutes('/_/backend');

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/kalaqan').then(() => {
  console.log('MongoDB Connected');
}).catch(err => {
  console.error('MongoDB Connection Error:', err);
});

// Socket.io
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
