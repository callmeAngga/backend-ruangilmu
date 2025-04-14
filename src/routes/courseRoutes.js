const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', courseController.getAllCourses);
router.get('/:id', courseController.getCourseById);

router.get('/user/enrolled', authMiddleware, courseController.getEnrolledCourses);
router.post('/:id/enroll', authMiddleware, courseController.enrollCourse);

module.exports = router;