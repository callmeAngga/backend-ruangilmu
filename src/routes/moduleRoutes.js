const express = require('express');
const router = express.Router();
const moduleController = require('../controllers/moduleController');
const authMiddleware = require('../middleware/authMiddleware');
const enrollmentMiddleware = require('../middleware/enrollmentMiddleware');

// Endpoint untuk mendapatkan semua module berdasarkan course_id
router.get('/:courseId/module', authMiddleware, moduleController.getModulesByCourse);

// Endpoint untuk mendapatkan module berdasarkan course_id dan module_id
// Endpoint ini digunakan untuk mendapatkan konten modul tertentu dan memverifikasi apakah modul sebelumnya sudah diselesaikan
router.get('/:courseId/module/:moduleId', authMiddleware, enrollmentMiddleware, moduleController.getModuleById);

// Endpoint untuk merubah status modul menjadi selesai untuk user
router.post('/:courseId/module/:moduleId/complete', authMiddleware, enrollmentMiddleware, moduleController.completeModule);

module.exports = router;