import admin from '../config/firebaseConfig.js';
import httpStatus from '../constants/httpStatus.js';
import { jwtSecret } from '../config/appConfig.js';
import { verifyToken } from '../utils/tokenUtils.js';
import { failResponse, errorResponse } from '../utils/responseUtil.js';

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

export default authMiddleware;