const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config/appConfig');
const httpStatus = require('../constants/httpStatus');
const admin = require('../config/firebaseConfig');
const { verifyToken } = require('../utils/tokenUtils');

const authMiddleware = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');

        // Coba verifikasi token lokal
        try {
            const decoded = verifyToken(token, jwtSecret);
            req.user = decoded;
            return next();
        } catch (localError) {
            // Jika gagal, verifikasi dengan Firebase
            try {
                const decodedFirebaseToken = await admin.auth().verifyIdToken(token);
                req.user = decodedFirebaseToken;
                return next();
            } catch (firebaseError) {
                return res.status(httpStatus.UNAUTHORIZED).json({
                    status: 'error',
                    message: 'Unauthorized',
                });
            }
        }
    } catch (error) {
        return res.status(httpStatus.UNAUTHORIZED).json({
            status: 'error',
            message: 'Unauthorized',
        });
    }
};

module.exports = authMiddleware;