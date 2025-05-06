const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const authMiddleware = require('../middleware/authMiddleware');

// Endpoint untuk menambahkan review baru
router.post('/', authMiddleware, reviewController.createReview);

// Endpoint untuk mendapatkan review tertentu berdasarkan course
router.get('/course/:courseId', authMiddleware. reviewController.getReviewsByCourse);

// Endpoint untuk mendapatkan review dari user yang sedang login untuk course tertentu
router.get('/user/course/:courseId', authMiddleware, reviewController.getUserReviewForCourse);

// Endpoint untuk mengupdate review
router.put('/:id', authMiddleware, reviewController.updateReview);

// Endpoint untuk menghapus review
router.delete('/:id', authMiddleware, reviewController.deleteReview);

module.exports = router;