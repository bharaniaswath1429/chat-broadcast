const amqp = require('amqplib');
require('dotenv').config();

let channel;

const connectRabbitMQ = async () => {
    try {
        const connection = await amqp.connect(process.env.RABBITMQ_URL);
        channel = await connection.createChannel();
        await channel.assertQueue('chatQueue');
        console.log('Connected to RabbitMQ');
    } catch (error) {
        console.error('Failed to connect to RabbitMQ', error);
    }
};

const getChannel = () => channel;

module.exports = { connectRabbitMQ, getChannel };
