import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import enrollmentMiddleware from '../middleware/enrollmentMiddleware.js';
import chatbotController from '../controllers/chatbotController.js';

const router = express.Router();

// Endpoint untuk summarize materi module
router.post('/course/:courseId/summarize', authMiddleware, enrollmentMiddleware, chatbotController.summarize);

// Route untuk mengirim pesan ke chatbot
router.post('/course/:courseId/message', authMiddleware, enrollmentMiddleware, chatbotController.sendMessage);

export default router;