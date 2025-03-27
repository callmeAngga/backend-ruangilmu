const bcrypt = require('bcrypt');
const User = require('../models/userModel');
const { comparePassword } = require('../utils/passwordUtils');
const { generateToken } = require('../utils/tokenUtils');

const login = async (email, password) => {
    const user = await User.findByEmail(email);
    if (!user) {
        throw new Error('Alamat Email belum terdaftar di sistem');
    }

    if (user.isVerified == false) {
        throw new Error('Email belum terverifikasi');
    }

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
        throw new Error('Email atau password salah');
    }

    // Token untuk user yang berhasil login
    const accessToken = generateToken({ id: user.user_id, role: user.role });

    // Token untuk refresh token
    const refreshToken = generateToken({ id: user.user_id }, '7d');

    return { user, accessToken, refreshToken };
};

const getMe = async (userId) => {
    const user = await User.findById(userId);
    if (!user) {
        throw new Error('User not found');
    }
    return user;
};

module.exports = { login, getMe };