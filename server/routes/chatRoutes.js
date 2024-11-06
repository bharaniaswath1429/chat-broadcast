const express = require('express');
const router = express.Router();
const { sendMessage } = require('../controllers/chatController');
const authenticateJWT = require('../middleware/authMiddleware');

router.post('/send', authenticateJWT, sendMessage);

module.exports = router;

