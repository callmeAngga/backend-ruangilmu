const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');
const validateRequest = require('../middleware/validateRequestMiddleware');
const { registerSchema, loginSchema, resetPasswordSchema } = require('../validators/authValidator');

router.post('/register', validateRequest(registerSchema), authController.register);
router.get('/verify-email', authController.verifyEmail);
router.post('/login', validateRequest(loginSchema), authController.login);
router.post('/oauth-google', authController.oauthGoogle);
router.post('/resend-verification', authController.resendVerificationEmail);
router.post('/refresh-token', authController.refreshToken);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', validateRequest(resetPasswordSchema), authController.resetPassword);
router.post('/logout', authMiddleware, authController.logout);

module.exports = router;