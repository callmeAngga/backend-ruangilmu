const { jwtSecret } = require('../config/appConfig');
const httpStatus = require('../constants/httpStatus');
const admin = require('../config/firebaseConfig');
const { verifyToken } = require('../utils/tokenUtils');

const authMiddleware = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        if (!token) {
            return res.status(httpStatus.UNAUTHORIZED).json({
                status: 'error',
                message: 'Token tidak ditemukan',
            });
        }
        try {
            const decoded = verifyToken(token, jwtSecret);
            req.user = decoded;
            return next();
        } catch (localError) {
            try {
                const decodedFirebaseToken = await admin.auth().verifyIdToken(token);
                req.user = decodedFirebaseToken;
                return next();
            } catch (firebaseError) {
                return res.status(httpStatus.UNAUTHORIZED).json({
                    status: 'error',
                    message: 'Firebase token tidak valid',
                });
            }
        }
    } catch (error) {
        return res.status(httpStatus.UNAUTHORIZED).json({
            status: 'error',
            message: 'Token tidak valid atau sudah kadaluarsa',
        });
    }
};

module.exports = authMiddleware;