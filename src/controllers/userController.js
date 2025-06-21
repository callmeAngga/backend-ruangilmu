import httpStatus from '../constants/httpStatus.js';
import userService from '../services/userService.js';
import AppError from '../utils/appError.js';
import { failResponse, successResponse, errorResponse } from '../utils/responseUtil.js';

const getMe = async (req, res) => {
    try {
        const user = await userService.findById(req.user.id);
        if (!user) {
            throw new AppError('User tidak ditemukan', httpStatus.NOT_FOUND, 'user');
        }
        
        return successResponse(res, httpStatus.OK, 'Berhasil mendapatkan data user', {
            user
        });
    } catch (error) {
        console.error(error.message);
        
        if (error instanceof AppError) {
            return failResponse(res, error.statusCode, "Gagal mendapatkan data user", [
                {
                    field: error.field,
                    message: error.message
                }
            ]);
        }

        return errorResponse(res);
    }
};

const updateProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        if (!userId) {
            throw new AppError('User ID tidak ditemukan', httpStatus.UNAUTHORIZED, 'user');
        }

        const profileData = req.body;
        if (!profileData) {
            throw new AppError('Data profil tidak ditemukan', httpStatus.BAD_REQUEST, 'profile');
        }

        const updatedUser = await userService.updateProfile(userId, profileData);

        return successResponse(res, httpStatus.OK, 'Berhasil memperbarui profil', {
            user: updatedUser
        });
    } catch (error) {
        console.error(error.message);
        
        if (error instanceof AppError) {
            return failResponse(res, error.statusCode, "Gagal memperbarui profil", [
                {
                    field: error.field,
                    message: error.message
                }
            ]);
        }

        return errorResponse(res);
    }
};

const updateProfilePicture = async (req, res) => {
    try {
        const userId = req.user.id;
        const profilePicture = req.file.filename;

        const updatedUser = await userService.updateProfilePicture(userId, profilePicture);

        return successResponse(res, httpStatus.OK, 'Berhasil memperbarui gambar profil', {
            user: updatedUser
        });
    } catch (error) {
        console.error(error.message);
        
        if (error instanceof AppError) {
            return failResponse(res, error.statusCode, "Gagal memperbarui gambar profil", [
                {
                    field: error.field,
                    message: error.message
                }
            ]);
        }

        return errorResponse(res);
    }
}

const updatePassword = async (req, res) => {
    try {
        const userId = req.user.id;
        const { currentPassword, newPassword } = req.body;
        
        await userService.updatePassword(userId, currentPassword, newPassword);
        
        return successResponse(res, httpStatus.OK, 'Password berhasil diperbarui', null);
    } catch (error) {
        console.error(error.message);
        
        if (error instanceof AppError) {
            return failResponse(res, error.statusCode, "Gagal memperbarui password", [
                {
                    field: error.field,
                    message: error.message
                }
            ]);
        }
        
        return errorResponse(res);
    }
};

export default {
    getMe,
    updateProfile,
    updateProfilePicture,
    updatePassword
};