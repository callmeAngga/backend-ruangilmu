import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import enrollmentMiddleware from '../middleware/enrollmentMiddleware.js';
import validateRequest from '../middleware/validateRequestMiddleware.js';
import reviewController from '../controllers/reviewController.js';
import { reviewContentSchema } from '../validators/reviewValidator.js';

const router = express.Router();

// Endpoint untuk menambahkan review baru
router.post('/', authMiddleware, validateRequest(reviewContentSchema), reviewController.createReview);

// Endpoint untuk mendapatkan review tertentu berdasarkan course
router.get('/course/:courseId', authMiddleware, reviewController.getReviewsByCourse);

// Endpoint untuk mendapatkan review dari user yang sedang login untuk course tertentu
router.get('/user/course/:courseId', authMiddleware, enrollmentMiddleware, reviewController.getUserReviewForCourse);

// Endpoint untuk mengupdate review
router.put('/update/:reviewId', authMiddleware, validateRequest(reviewContentSchema), reviewController.updateReview);

// Endpoint untuk menghapus review
router.delete('/delete/:reviewId', authMiddleware, reviewController.deleteReview);

export default router;