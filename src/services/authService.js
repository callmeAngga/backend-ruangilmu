const User = require('../models/userModel');
const { comparePassword } = require('../utils/passwordUtils');
const { generateToken } = require('../utils/tokenUtils');
const admin = require('../config/firebaseConfig');
const { hashPassword } = require('../utils/passwordUtils');

const login = async (email, password) => {
    const user = await User.findByEmail(email);
    if (!user) {
        throw new Error('Alamat Email belum terdaftar di sistem');
    }

    // console.log('[DEBUG] User found:', user.isVerified);
    if (!user.isverified) {
        throw new Error('Email belum terverifikasi');
    }

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
        throw new Error('Password yang anda masukkan salah');
    }

    // Token untuk user yang berhasil login
    const accessToken = generateToken({ id: user.user_id, role: user.role });

    // Token untuk refresh token
    const refreshToken = generateToken({ id: user.user_id }, '7d');

    return { user, accessToken, refreshToken };
};

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
        console.error('[ERROR] loginFirebase:', error);
        throw new Error('Firebase login failed');
    }
};

const getUserByFirebaseUid = async (firebaseUid) => {
    const user = await User.findByFirebaseUid(firebaseUid);
    if (!user) {
        throw new Error('User not found');
    }
    return user;
}

module.exports = { login, loginFirebase, getUserByFirebaseUid };