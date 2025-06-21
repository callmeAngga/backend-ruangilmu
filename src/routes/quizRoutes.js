import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import enrollmentMiddleware from '../middleware/enrollmentMiddleware.js';
import quizController from '../controllers/quizController.js';

const router = express.Router();

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

export default router;