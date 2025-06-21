import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import courseController from '../controllers/courseController.js';

const router = express.Router();

// Endpoint untuk mendapatkan semua course
router.get('/', courseController.getAllCourses);

// Endpoint untuk memndapatkan course tertentu berdasarkan course_id
router.get('/:courseId', courseController.getCourseById);

// Endpoint untuk mendapatkan course tertentu berdasarkan course_slug
router.get('/detail/:courseSlug', courseController.getCourseBySlug);

// Endpoint untuk enroll course
router.post('/:courseId/enroll', authMiddleware, courseController.enrollCourse);

// Endpoint untuk mendapatkan semua course yang sudah terenroll oleh user yang sedang login
router.get('/user/enrolled', authMiddleware, courseController.getEnrolledCourses);

// Endpoint untuk cek status enrollment
router.get('/:courseId/enrollment-status', authMiddleware, courseController.checkEnrollmentStatus);

export default router;