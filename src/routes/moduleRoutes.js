const express = require('express');
const router = express.Router();
const moduleController = require('../controllers/moduleController');
const quizController = require('../controllers/quizController');
const certificateController = require('../controllers/certificateController');
const authMiddleware = require('../middleware/authMiddleware');
const enrollmentMiddleware = require('../middleware/enrollmentMiddleware');

// Middleware untuk memeriksa apakah pengguna sudah enroll dalam course
// router.use('/:courseId', enrollmentMiddleware);

// Rute untuk modul
router.get('/:courseId', authMiddleware, moduleController.getModulesByCourse);
router.get('/:courseId/:moduleId', authMiddleware, moduleController.getModuleById);
router.post('/:courseId/:moduleId/complete', authMiddleware, moduleController.completeModule);

// Rute untuk kuis/ujian
router.get('/:courseId/:moduleId/quiz', authMiddleware, quizController.getModuleQuiz);
router.post('/:courseId/:moduleId/quiz/submit', authMiddleware, quizController.submitModuleQuiz);
router.get('/:courseId/final-exam', authMiddleware, quizController.getFinalExam);
router.post('/:courseId/final-exam/submit', authMiddleware, quizController.submitFinalExam);

// Rute untuk sertifikat
router.get('/:courseId/certificate', authMiddleware, certificateController.getCertificate);
router.get('/:courseId/certificate/download', authMiddleware, certificateController.downloadCertificate);
router.get('/certificates', authMiddleware, certificateController.getUserCertificates);
router.get('/certificates/verify/:certificateNumber', certificateController.verifyCertificate);

module.exports = router;