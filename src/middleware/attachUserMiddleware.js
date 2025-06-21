import httpStatus from '../constants/httpStatus.js';
import userService from '../services/userService.js';
import AppError from '../utils/appError.js';
import { failResponse, errorResponse } from '../utils/responseUtil.js';

async function attachUser(req, res, next) {
    try {
        const user = await userService.findById(req.user.id);
        if (!user) {
            throw new AppError('User tidak ditemukan', httpStatus.NOT_FOUND, 'user');
        }
        req.user = {
            id: user.user_id,
            email: user.email
        };
        next();
    } catch (err) {
        console.error(err.message);

        if (err instanceof AppError) {
            return failResponse(res, err.statusCode, 'Gagal mendapatkan data user', [
                {
                    field: err.field,
                    message: err.message
                }
            ]);
        }

        return errorResponse(res);
    }
}

export default attachUser;