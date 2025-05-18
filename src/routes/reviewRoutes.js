const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const authMiddleware = require('../middleware/authMiddleware');
const enrollmentMiddleware = require('../middleware/enrollmentMiddleware');
const validateRequest = require('../middleware/validateRequestMiddleware');
const { reviewContentSchema } = require('../validators/reviewValidator');

// Endpoint untuk menambahkan review baru
router.post('/', authMiddleware, enrollmentMiddleware, validateRequest(reviewContentSchema), reviewController.createReview);

// Endpoint untuk mendapatkan review tertentu berdasarkan course
router.get('/course/:courseId', authMiddleware, reviewController.getReviewsByCourse);

// Endpoint untuk mendapatkan review dari user yang sedang login untuk course tertentu
router.get('/user/course/:courseId', authMiddleware, enrollmentMiddleware, reviewController.getUserReviewForCourse);

// Endpoint untuk mengupdate review
router.put('/update/:reviewId', authMiddleware, validateRequest(reviewContentSchema), reviewController.updateReview);

// Endpoint untuk menghapus review
router.delete('/delete/:reviewId', authMiddleware, reviewController.deleteReview);

module.exports = router;