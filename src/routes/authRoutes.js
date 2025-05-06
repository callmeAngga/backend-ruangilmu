const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');
const validateRequest = require('../middleware/validateRequestMiddleware');
const { registerSchema, loginSchema, googleAuthSchema } = require('../validators/authValidator');
const ROLES = require('../constants/roles');


router.post('/register', validateRequest(registerSchema), authController.register);
router.post('/login', validateRequest(loginSchema), authController.login);
router.post('/oauth-google', authController.oauthGoogle);
router.post('/logout', authMiddleware, authController.logout);
router.get('/verify-email', authController.verifyEmail);
router.post('/refresh-token', authController.refreshToken);

router.post('/resend-verification', authController.resendVerificationEmail);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);

module.exports = router;