const express = require('express');
const router = express.Router();
const chatbotController = require('../controllers/chatbotController');
const authMiddleware = require('../middleware/authMiddleware');
const enrollmentMiddleware = require('../middleware/enrollmentMiddleware');


// Endpoint untuk summarize materi module
router.post('/course/:courseId/summarize', authMiddleware, enrollmentMiddleware, chatbotController.summarize);

// Route untuk mengirim pesan ke chatbot
router.post('/course/:courseId/message', authMiddleware, enrollmentMiddleware, chatbotController.sendMessage);

module.exports = router;