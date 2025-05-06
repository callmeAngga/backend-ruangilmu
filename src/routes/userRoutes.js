const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const userController = require('../controllers/userController');


router.get('/me', authMiddleware, userController.getMe);
router.post('/update-profile', authMiddleware, userController.updateProfile);


// router.get('/dashboard', authMiddleware, roleMiddleware([ROLES.USER || ROLES.ADMIN]), (req, res) => {
//     res.json({ message: 'Selamat Datang di Dashboard' });
// }
// );

// router.get('/dashboard-admin', authMiddleware, roleMiddleware([ROLES.ADMIN]), (req, res) => {
//     res.json({ message: 'Selamat Datang di Dashboard Admin' });
// }
// );

module.exports = router;