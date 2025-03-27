const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');
const validateRequest = require('../middleware/validateRequestMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const { registerSchema, loginSchema } = require('../validators/authValidator');
const ROLES = require('../constants/roles');


router.post('/register', validateRequest(registerSchema), authController.register);
router.post('/login', validateRequest(loginSchema), authController.login);
router.post('/logout', authController.logout);
router.get('/me', authMiddleware, authController.getMe);
router.get('/verify-email', authController.verifyEmail);
router.post('/refresh-token', authController.refreshToken);


router.get('/dashboard', authMiddleware, roleMiddleware([ROLES.USER]), (req, res) => {
    res.json({ message: 'Selamat Datang di Dashboard' });
}
);

router.get('/dashboard-admin', authMiddleware, roleMiddleware([ROLES.ADMIN]), (req, res) => {
    res.json({ message: 'Selamat Datang di Dashboard Admin' });
}
);

module.exports = router;