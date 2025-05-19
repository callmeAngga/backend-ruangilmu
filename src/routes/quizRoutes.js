const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quizController');
const authMiddleware = require('../middleware/authMiddleware');
const enrollmentMiddleware = require('../middleware/enrollmentMiddleware');

// Endpoin ini digunakan untuk mendapatkan kuis yang terkait dengan modul tertentu dalam kursus
// Endpoin ini juga mengembalikan hasil kuis sebelumnya jika ada
router.get('/:courseId/module/:moduleId/quiz', authMiddleware, enrollmentMiddleware, quizController.getModuleQuiz);

// Endpoin ini digunakan untuk mengirimkan jawaban kuis modul
// Endpoin ini juga menyimpan hasil kuis dan mengembalikan hasilnya
// Jika kuis sudah selesai sebelumnya, maka hasilnya akan diambil dari database
router.post('/:courseId/module/:moduleId/quiz/submit', authMiddleware, enrollmentMiddleware, quizController.submitModuleQuiz);

// Endpoin ini digunakan untuk mendapatkan ujian akhir dari kursus tertentu
// Endpoin ini juga mengembalikan hasil ujian akhir sebelumnya jika ada
// Jika ujian akhir sudah selesai sebelumnya, maka hasilnya akan diambil dari database
router.get('/:courseId/final-exam', authMiddleware, enrollmentMiddleware, quizController.getFinalExam);

// Endpoin ini digunakan untuk mengirimkan jawaban ujian akhir
// Endpoin ini juga menyimpan hasil ujian akhir dan mengembalikan hasilnya
// Jika ujian akhir sudah selesai sebelumnya, maka hasilnya akan diambil dari database
router.post('/:courseId/final-exam/submit', authMiddleware, enrollmentMiddleware, quizController.submitFinalExam);

module.exports = router;