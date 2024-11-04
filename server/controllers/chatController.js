const Message = require('../models/messageModel');
const { getChannel } = require('../config/rabbitmq');

exports.sendMessage = async (req, res) => {
    const { content } = req.body;
    const newMessage = await Message.create({ content, userId: req.user.id });
    const channel = getChannel();

    if (channel) {
        channel.sendToQueue('chatQueue', Buffer.from(JSON.stringify(newMessage)));
    }
    res.status(201).json(newMessage);
};
