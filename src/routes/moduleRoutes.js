const express = require('express');
const router = express.Router();
const moduleController = require('../controllers/moduleController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/:courseId', authMiddleware, moduleController.getModulesByCourse);
router.get('/:courseId/:moduleId', authMiddleware, moduleController.getModuleById);
router.post('/:courseId/:moduleId/complete', authMiddleware, moduleController.completeModule);

module.exports = router;