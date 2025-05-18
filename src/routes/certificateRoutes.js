const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const certificateController = require('../controllers/certificateController');

// Rute untuk sertifikat
router.get('/:courseId/certificate', authMiddleware, certificateController.getCertificate);
router.get('/:courseId/certificate/download', authMiddleware, certificateController.downloadCertificate);
router.get('/certificates', authMiddleware, certificateController.getUserCertificates);
router.get('/certificates/verify/:certificateNumber', certificateController.verifyCertificate);

module.exports = router;