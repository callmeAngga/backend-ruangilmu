import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import { uploadProfilePicture } from '../middleware/uploadProfileMiddleware.js';
import validateRequest from '../middleware/validateRequestMiddleware.js';
import attachUser from '../middleware/attachUserMiddleware.js';
import userController from '../controllers/userController.js';
import { changePasswordSchema } from '../validators/authValidator.js';

const router = express.Router();

router.get('/me', authMiddleware, userController.getMe);
router.post('/update-profile', authMiddleware, userController.updateProfile);
router.post('/update-profile-picture', authMiddleware, attachUser, uploadProfilePicture, userController.updateProfilePicture);
router.post('/change-password', authMiddleware, validateRequest(changePasswordSchema), userController.updatePassword);

export default router;