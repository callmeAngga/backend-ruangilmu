import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import httpStatus from '../constants/httpStatus.js';
import User from '../models/userModel.js';        
import emailService from './emailService.js';     
import AppError from '../utils/appError.js';        
import { failResponse } from '../utils/responseUtil.js';
import { generateToken, verifyToken } from '../utils/tokenUtils.js';
import { hashPassword, comparePassword } from '../utils/passwordUtils.js'; 

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const jwtSecret = process.env.JWT_SECRET;

const findByEmail = async (email) => {
    return await User.findByEmail(email);
};

const findById = async (id) => {
    return await User.findById(id);
};

const create = async (nama, email, password) => {
    return await User.create(nama, email, password);
};

const verifyEmail = async (userId) => {
    const user = await User.findById(userId);
    if (!user) {
        throw new Error('User tidak ditemukan');
    }

    if (user.isVerified) {
        throw new Error('Email sudah terverifikasi');
    }

    const updatedUser = await User.verifyEmail(userId);

    return updatedUser;
};

const updateProfile = async (userId, profileData) => {
    console.log('BABI',profileData);
    const user = await User.findById(userId);
    if (!user) {
        throw new AppError('User tidak ditemukan', httpStatus.NOT_FOUND, 'user_id');
    }

    const updatedUser = await User.updateProfile(userId, profileData);
    return updatedUser;
};

const requestPasswordReset = async (email) => {
    const user = await User.findByEmail(email);
    if (!user) {
        return failResponse(res, httpStatus.NOT_FOUND, 'Email tidak ditemukan', [
            {
                field: 'email',
                message: 'Email tidak ditemukan'
            }
        ]);
    }

    const resetToken = generateToken({
        id: user.user_id,
        email: user.email
    });

    const resetLink = `${process.env.BASE_URL}/auth/reset-password?token=${resetToken}`;
    await emailService.sendResetPasswordEmail(user.email, user.nama, resetLink);

    return { message: 'Link reset password telah dikirim ke email Anda' };
};

const resetPassword = async (token, newPassword) => {
    try {
        const decoded = verifyToken(token, jwtSecret);

        const user = await User.findById(decoded.id);
        if (!user) {
            throw new AppError('User tidak ditemukan, pastikan token valid dan belum kadaluarsa', httpStatus.NOT_FOUND, 'user_id');
        }

        const hashedPassword = await hashPassword(newPassword);

        await User.updatePassword(user.user_id, hashedPassword);

        return { message: 'Password berhasil diubah' };
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            throw new Error('Token sudah kadaluarsa');
        }
        throw error;
    }
};

const updateProfilePicture = async (userId, profilePicture) => {
    const user = await User.findById(userId);
    if (!user) {
        throw new AppError('User tidak ditemukan', httpStatus.NOT_FOUND, 'user_id');
    }

    if (user.user_profile && typeof user.user_profile === 'string' && user.user_profile.trim() !== '') {
        try {
            const oldFilePath = path.join(__dirname, `../uploads/userprofile`, user.user_profile);
            
            if (fs.existsSync(oldFilePath)) {
                fs.unlinkSync(oldFilePath);
            } else {
                console.log('INFO: Old profile picture does not exist at path:', oldFilePath);
            }
        } catch (error) {
            console.error('ERROR: Gagal menghapus file lama:', error.message);
            throw new AppError('Gagal menghapus gambar profil lama', httpStatus.INTERNAL_SERVER_ERROR, 'profile_picture');
        }
    } else {
        console.log('INFO: User does not have an existing profile picture or path is invalid.');
    }

    const updatedUser = await User.updateProfilePicture(userId, profilePicture);
    return updatedUser;
};

const updatePassword = async (userId, currentPassword, newPassword) => {
    const user = await User.findById(userId);
    if (!user) {
        throw new AppError('User tidak ditemukan', httpStatus.NOT_FOUND, 'user_id');
    }

    const isMatch = await comparePassword(currentPassword, user.password);
    if (!isMatch) {
        throw new AppError('Password salah, tolong masukan password lama dengan benar', httpStatus.UNAUTHORIZED, 'current_password');
    }

    const hashedPassword = await hashPassword(newPassword);
    await User.updatePassword(user.user_id, hashedPassword);

    return { message: 'Password berhasil diperbarui' };
};

export default {
    findByEmail,
    findById,
    create,
    verifyEmail,
    resetPassword,
    updateProfile,
    requestPasswordReset,
    updateProfilePicture,
    updatePassword 
}