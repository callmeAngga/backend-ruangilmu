const User = require('../models/userModel');
const { generateToken, verifyToken } = require('../utils/tokenUtils');
const { hashPassword } = require('../utils/passwordUtils');

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
        throw new Error('Email tidak terdaftar');
    }
    
    const resetToken = generateToken({ 
        id: user.user_id, 
        email: user.email
    }, '1h');
    
    const resetLink = `${process.env.BASE_URL}/auth/reset-password?token=${resetToken}`;
    await emailService.sendResetPasswordEmail(user.email, user.nama, resetLink);
    
    return { message: 'Link reset password telah dikirim ke email Anda' };
};

const resetPassword = async (token, newPassword) => {
    try {
        const decoded = verifyToken(token, jwtSecret);
        
        if (decoded.purpose !== 'password-reset') {
            throw new Error('Token tidak valid');
        }
        
        const user = await User.findById(decoded.id);
        if (!user) {
            throw new Error('User tidak ditemukan');
        }
        
        if (decoded.email !== user.email) {
            throw new Error('Token tidak valid');
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
