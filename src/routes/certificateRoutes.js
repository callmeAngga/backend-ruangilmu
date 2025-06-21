import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import enrollmentMiddleware from '../middleware/enrollmentMiddleware.js';
import certificateController from '../controllers/certificateController.js';

const router = express.Router();

// Endpoint ini digunakan untuk mendapatkan sertifikat dari course yang telah diselesaikan
router.get('/:courseId/certificate', authMiddleware, enrollmentMiddleware, certificateController.getCertificate);

// Endpoint ini digunakan untuk mengunduh sertifikat dari course yang telah diselesaikan
router.get('/:courseId/certificate/download', authMiddleware,enrollmentMiddleware, certificateController.downloadCertificate);

// Endpoint ini digunakan untuk mendapatkan semua sertifikat yang dimiliki oleh user
router.get('/certificates', authMiddleware,  certificateController.getUserCertificates);

// Endpoint ini digunakan untuk mendapatkan sertifikat berdasarkan nomor sertifikat
router.get('/certificates/verify/:certificateNumber', certificateController.verifyCertificate);

export default router;