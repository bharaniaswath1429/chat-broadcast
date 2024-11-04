const express = require('express');
const dotenv = require('dotenv');
const sequelize = require('./config/db');
const { connectRabbitMQ } = require('./config/rabbitmq');
const authRoutes = require('./routes/authRoutes');
const chatRoutes = require('./routes/chatRoutes');
const WebSocket = require('ws');
const authenticateJWT = require('./middleware/authMiddleware');

dotenv.config();

const app = express();
app.use(express.json());

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

        const server = app.listen(process.env.PORT || 8000, () => {
            console.log(`Server running on port ${process.env.PORT || 8000}`);
        });

        const wss = new WebSocket.Server({ server });

        wss.on('connection', (ws) => {
            console.log('User connected to WebSocket.');
            ws.on('message', (message) => {
                wss.clients.forEach((client) => {
                    if (client.readyState === WebSocket.OPEN) {
                        client.send(message);
                    }
                });
            });
        });
    } catch (error) {
        console.error('Error starting the server:', error);
    }
};

startServer();
