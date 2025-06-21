import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import validateRequest from '../middleware/validateRequestMiddleware.js';
import authController from '../controllers/authController.js';
import { registerSchema, loginSchema, resetPasswordSchema } from '../validators/authValidator.js';

const router = express.Router();

// Endpoint untuk registrasi pengguna baru
// Endpoint ini akan memvalidasi data yang diterima dan menyimpan pengguna baru ke dalam database
router.post('/register', validateRequest(registerSchema), authController.register);

// Endpoint untuk verifikasi email pengguna
// Endpoint ini akan memverifikasi email pengguna berdasarkan token yang dikirimkan melalui email
router.get('/verify-email', authController.verifyEmail);

// Endpoint untuk login pengguna
// Endpoint ini akan memverifikasi kredensial pengguna dan memberikan access token dan refresh token
router.post('/login', validateRequest(loginSchema), authController.login);

// Endpoint untuk login menggunakan Google OAuth
// Endpoint ini akan memverifikasi token yang diterima dari Google dan memberikan access token dan refresh token
router.post('/oauth-google', authController.oauthGoogle);

// Endpoint untuk mengirim ulang email verifikasi
// Endpoint ini akan mengirimkan email verifikasi ke alamat email pengguna yang terdaftar
router.post('/resend-verification', authController.resendVerificationEmail);

// Endpoint untuk refresh token
// Endpoint ini akan memverifikasi refresh token dan memberikan access token baru
router.post('/refresh-token', authController.refreshToken);

// Endpoint apablau pengguna lupa password
// Endpoint ini akan mengirimkan email untuk mereset password pengguna
router.post('/forgot-password', authController.forgotPassword);

// Endpoint untuk mereset password pengguna
// Endpoint ini akan memverifikasi token yang diterima dan memperbarui password pengguna
router.post('/reset-password', validateRequest(resetPasswordSchema), authController.resetPassword);

// Endpoint untuk logout pengguna
// Endpoint ini akan menghapus refresh token dari database
router.post('/logout', authMiddleware, authController.logout);

export default router;