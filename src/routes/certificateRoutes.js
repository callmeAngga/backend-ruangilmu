const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const certificateController = require('../controllers/certificateController');
const enrollmentMiddleware = require('../middleware/enrollmentMiddleware');

// Endpoint ini digunakan untuk mendapatkan sertifikat dari course yang telah diselesaikan
router.get('/:courseId/certificate', authMiddleware, enrollmentMiddleware, certificateController.getCertificate);

// Endpoint ini digunakan untuk mengunduh sertifikat dari course yang telah diselesaikan
router.get('/:courseId/certificate/download', authMiddleware,enrollmentMiddleware, certificateController.downloadCertificate);

// Endpoint ini digunakan untuk mendapatkan semua sertifikat yang dimiliki oleh user
router.get('/certificates', authMiddleware,  certificateController.getUserCertificates);

// Endpoint ini digunakan untuk mendapatkan sertifikat berdasarkan nomor sertifikat
router.get('/certificates/verify/:certificateNumber', certificateController.verifyCertificate);

module.exports = router;