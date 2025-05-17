const User = require('../models/userModel');
const { comparePassword } = require('../utils/passwordUtils');
const { generateToken } = require('../utils/tokenUtils');
const admin = require('../config/firebaseConfig');
const { hashPassword } = require('../utils/passwordUtils');
const AppError = require('../utils/appError');
const httpStatus = require('../constants/httpStatus');

// Fungsi untuk login user
// Fungsi ini akan memeriksa apakah email sudah terdaftar, apakah user sudah terverifikasi, dan apakah password yang dimasukkan sesuai dengan password yang ada di database
const login = async (email, password) => {

    // Cek apakah email sudah terdaftar
    const user = await User.findByEmail(email);
    if (!user) {
        throw new AppError('Alamat Email belum terdaftar di sistem Ruang Ilmu', httpStatus.NOT_FOUND, 'email');
    }

    // Cek apakah user sudah terverifikasi
    if (!user.isverified) {
        throw new AppError('Email belum terverifikasi, silakan verifikasi email anda', httpStatus.FORBIDDEN, 'email');
    }

    // Cek apakkah password yang dimasukkan sesuai dengan password yang ada di database
    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
        throw new AppError('Password yang anda masukkan salah', httpStatus.UNAUTHORIZED, 'password');
    }

    // Token untuk user yang berhasil login
    const accessToken = generateToken({ id: user.user_id, role: user.role });

    // Token untuk refresh token
    const refreshToken = generateToken({ id: user.user_id, role: user.role }, '7d');

    return { user, accessToken, refreshToken };
};

// Fungsi untuk login user menggunakan Firebase
// Fungsi ini akan memeriksa apakah user sudah terdaftar di Firebase, jika belum maka akan membuat user baru di database
const loginFirebase = async (idToken) => {
    try {
        const decodedToken = await admin.auth().verifyIdToken(idToken);;

        let user = await User.findByFirebaseUid(decodedToken.uid);

        if (!user) {
            user = await User.findByEmail(decodedToken.email);

            if (user) {
                await User.updateFirebaseUid(user.user_id, decodedToken.uid);
            } else {
                const hashedPassword = await hashPassword("Password123");
                user = await User.create(
                    decodedToken.name || decodedToken.email.split('@')[0],
                    decodedToken.email,
                    hashedPassword,
                    'user',
                    true
                );
                user = await User.updateFirebaseUid(user.user_id, decodedToken.uid);
            }
        }

        const accessToken = generateToken({ id: user.user_id, role: user.role });
        const refreshToken = generateToken({ id: user.user_id }, '7d');

        return { user, accessToken, refreshToken };
    } catch (error) {
        console.error('LoginFirebase:', error);

        if (error.code === 'auth/id-token-expired') {
            throw new AppError(
                'ID Token telah kedaluwarsa. Silakan login ulang.',
                httpStatus.UNAUTHORIZED,
                'idToken'
            );
        }

        if (error.code === 'auth/argument-error') {
            throw new AppError(
                'ID Token tidak valid. Pastikan token dari Firebase benar.',
                httpStatus.UNAUTHORIZED,
                'idToken'
            );
        }

        throw new AppError('Firebase login failed', httpStatus.INTERNAL_SERVER_ERROR, 'firebase');
    }
};

// Fungsi untuk mendapatkan user berdasarkan firebaseUid
// Fungsi ini akan mengembalikan user yang terdaftar di database berdasarkan firebaseUid
const getUserByFirebaseUid = async (firebaseUid) => {
    const user = await User.findByFirebaseUid(firebaseUid);
    if (!user) {
        throw new AppError('User not found', httpStatus.NOT_FOUND, 'firebaseUid');
    }
    return user;
}

module.exports = { login, loginFirebase, getUserByFirebaseUid };