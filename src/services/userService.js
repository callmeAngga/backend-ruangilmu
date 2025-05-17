const User = require('../models/userModel');
const { generateToken, verifyToken } = require('../utils/tokenUtils');
const { hashPassword } = require('../utils/passwordUtils');
const emailService = require('./emailService');
const { failResponse, errorResponse } = require('../utils/responseUtil');

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
    const user = await User.findById(userId);
    if (!user) {
        throw new Error('User tidak ditemukan');
    }

    const updatedUser = await User.updateProfile(userId, profileData);
    return updatedUser;
};


const getMe = async (userId) => {
    const user = await User.findById(userId);
    if (!user) {
        throw new Error('User not found');
    }
    return user;
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
            // throw new Error('User tidak ditemukan');
            throw new AppError('User tidak ditemukan', httpStatus.NOT_FOUND, 'user_id', [
                {
                    field: 'user_id',
                    message: 'User tidak ditemukan, pastikan token valid dan belum kadaluarsa'
                }
            ]);
        }

        const hashedPassword = await hashPassword(newPassword);

        // Update password
        await User.updatePassword(user.user_id, hashedPassword);

        return { message: 'Password berhasil diubah' };
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            throw new Error('Token sudah kadaluarsa');
        }
        throw error;
    }
};

module.exports = { findByEmail, findById, create, verifyEmail, resetPassword, updateProfile, getMe, requestPasswordReset };
