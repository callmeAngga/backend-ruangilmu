const { jwtSecret } = require('../config/appConfig');
const httpStatus = require('../constants/httpStatus');
const admin = require('../config/firebaseConfig');
const { verifyToken } = require('../utils/tokenUtils');
const { failResponse, errorResponse } = require('../utils/responseUtil');

const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.header('Authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return failResponse(res, httpStatus.UNAUTHORIZED, 'Token tidak ditemukan', [
                {
                    field: 'Authorization',
                    message: 'Header Authorization dengan format Bearer token harus disediakan'
                }
            ]);
        }

        const token = authHeader.replace('Bearer ', '');

        try {
            const decoded = verifyToken(token, jwtSecret);
            req.user = decoded;
            return next();
        } catch (localError) {
            // Jika token lokal gagal, coba validasi dengan Firebase
            try {
                const decodedFirebaseToken = await admin.auth().verifyIdToken(token);
                req.user = decodedFirebaseToken;
                return next();
            } catch (firebaseError) {
                return failResponse(res, httpStatus.UNAUTHORIZED, 'Token Firebase tidak valid', [
                    {
                        field: 'Authorization',
                        message: 'Token tidak valid sebagai Firebase token'
                    }
                ]);
            }
        }
    } catch (error) {
        console.error('Auth Middleware Error:', error);
        return errorResponse(res);
    }
};

module.exports = authMiddleware;
