const express = require('express');
const dotenv = require('dotenv');
const sequelize = require('./config/db');
const { connectRabbitMQ } = require('./config/rabbitmq');
const authRoutes = require('./routes/authRoutes');
const chatRoutes = require('./routes/chatRoutes');
const authenticateJWT = require('./middleware/authMiddleware');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');

dotenv.config();

const app = express();
const server = http.createServer(app);

// Set up Socket.io
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

app.use(express.json());
app.use(
  cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  })
);

app.use('/auth', authRoutes);
app.use('/chat', authenticateJWT, chatRoutes);

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected successfully.');
    
    await sequelize.sync();
    console.log('Database synchronized.');
    
    await connectRabbitMQ();
    console.log('RabbitMQ connected successfully.');

    io.on('connection', (socket) => {
      console.log('A user connected.');

      socket.on('join', ({ userName }) => {
        socket.userName = userName;
        io.emit('userJoined', { userName });
        updateUsersList();
      });

      socket.on('message', (message) => {
        io.emit('message', message);
      });

      socket.on('disconnect', () => {
        console.log('A user disconnected.');
        if (socket.userName) {
          io.emit('userLeft', { userName: socket.userName });
        }
        updateUsersList();
      });

      const updateUsersList = () => {
        const users = Array.from(io.sockets.sockets.values())
          .filter((s) => s.userName)
          .map((s) => ({ userName: s.userName }));
        io.emit('updateUsers', users);
      };
    });

    const port = process.env.PORT || 8000;
    server.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (error) {
    console.error('Error starting the server:', error);
  }
};

startServer();
