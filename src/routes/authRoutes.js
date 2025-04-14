const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');
const validateRequest = require('../middleware/validateRequestMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const { registerSchema, loginSchema, googleAuthSchema } = require('../validators/authValidator');
const ROLES = require('../constants/roles');


router.post('/register', validateRequest(registerSchema), authController.register);
router.post('/login', validateRequest(loginSchema), authController.login);
router.post('/oauth-google', authController.oauthGoogle);
router.post('/logout', authMiddleware, authController.logout);
router.get('/verify-email', authController.verifyEmail);
router.post('/refresh-token', authController.refreshToken);

// router.get('/me', authMiddleware, authController.getMe);



module.exports = router;