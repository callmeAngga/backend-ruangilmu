const express = require('express');
const router = express.Router();


router.get('/dashboard', authMiddleware, roleMiddleware([ROLES.USER || ROLES.ADMIN]), (req, res) => {
    res.json({ message: 'Selamat Datang di Dashboard' });
}
);

router.get('/dashboard-admin', authMiddleware, roleMiddleware([ROLES.ADMIN]), (req, res) => {
    res.json({ message: 'Selamat Datang di Dashboard Admin' });
}
);