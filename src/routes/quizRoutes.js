const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quizController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/:courseId/:moduleId/quiz', authMiddleware, quizController.getModuleQuiz);
router.post('/:courseId/:moduleId/quiz/submit', authMiddleware, quizController.submitModuleQuiz);
router.get('/:courseId/final-exam', authMiddleware, quizController.getFinalExam);
router.post('/:courseId/final-exam/submit', authMiddleware, quizController.submitFinalExam);

module.exports = router;