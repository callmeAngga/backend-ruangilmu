const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const authMiddleware = require('../middleware/authMiddleware');

// Route untuk mendapatkan semua course
router.get('/', courseController.getAllCourses);

// Route untuk memndapatkan course tertentu berdasarkan course_id
router.get('/:courseId', courseController.getCourseById);

// Route untuk mendapatkan course tertentu berdasarkan course_slug
router.get('/detail/:courseSlug', courseController.getCourseBySlug);

// Route untuk enroll course
router.post('/:courseId/enroll', authMiddleware, courseController.enrollCourse);

// Route untuk mendapatkan semua course yang sudah terenroll oleh user yang sedang login
router.get('/user/enrolled', authMiddleware, courseController.getEnrolledCourses);

// Route untuk cek status enrollment
router.get('/:courseId/enrollment-status', authMiddleware, courseController.checkEnrollmentStatus);

module.exports = router;