const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const userController = require('../controllers/userController');
const { uploadProfilePicture } = require('../middleware/uploadProfileMiddleware');
const validateRequest = require('../middleware/validateRequestMiddleware');
const { changePasswordSchema } = require('../validators/authValidator');

router.get('/me', authMiddleware, userController.getMe);
router.post('/update-profile', authMiddleware, userController.updateProfile);
router.post('/update-profile-picture', authMiddleware, uploadProfilePicture, userController.updateProfilePicture);
router.post('/change-password', authMiddleware, validateRequest(changePasswordSchema), userController.updatePassword);

module.exports = router;