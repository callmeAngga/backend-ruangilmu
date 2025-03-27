const User = require('../models/userModel');

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

module.exports = { findByEmail, findById, create, verifyEmail };
