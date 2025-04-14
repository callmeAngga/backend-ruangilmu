const bcrypt = require('bcrypt');
const User = require('../models/userModel');
const { comparePassword } = require('../utils/passwordUtils');
const { generateToken } = require('../utils/tokenUtils');
const admin = require('../config/firebaseConfig');

const login = async (email, password) => {
    const user = await User.findByEmail(email);
    if (!user) {
        throw new Error('Alamat Email belum terdaftar di sistem');
    }

    if (user.isVerified === false) {
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

const loginFirebase = async (idToken) => {
    try {
        console.log('[DEBUG] Verifying Firebase token...');
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        // try {
        // } catch (error) {
        //     console.error('[ERROR] Firebase token verification failed:', error);
        //     throw new Error('Invalid Firebase token');
        // }
        console.log('[DEBUG] Firebase token verified successfully.'); 
            

        console.log('[DEBUG] UID:', decodedToken.uid);
        let user = await User.findByFirebaseUid(decodedToken.uid);

        if (!user) {
            console.log('[DEBUG] No user with firebase UID, checking by email...');
            user = await User.findByEmail(decodedToken.email);

            if (user) {
                console.log('[DEBUG] Found user by email, updating firebase_uid...');
                await User.updateFirebaseUid(user.user_id, decodedToken.uid);   
            } else {
                console.log('[DEBUG] Creating new user...');
                user = await User.create(
                    decodedToken.name || decodedToken.email.split('@')[0],
                    decodedToken.email,
                    null,
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


// const loginFirebase = async (idToken) => {
//     try {
//         const decodedToken = await admin.auth().verifyIdToken(idToken);
//         let user = await User.findByFirebaseUid(decodedToken.uid);

//         if (!user) {
//             user = await User.findByEmail(decodedToken.email);

//             if (user) {
//                 await User.updateFirebaseUid(user.user_id, decodedToken.uid);   
//             } else {
//                 user = await User.create(decodedToken.name || decodedToken.email.split('@')[0], decodedToken.email, null, 'user', true);
//                 user = await User.updateFirebaseUid(user.user_id, decodedToken.uid);
//             }
//         }

//         const accessToken = generateToken({ id: user.user_id, role: user.role });
//         const refreshToken = generateToken({ id: user.user_id }, '7d');

//         return { user, accessToken, refreshToken };
//     } catch (error) {
//         throw new Error('Firebase login failed');
//     }
// }

const getUserByFirebaseUid = async (firebaseUid) => {
    const user = await User.findByFirebaseUid(firebaseUid);
    if (!user) {
        throw new Error('User not found');
    }
    return user;
}

const getMe = async (userId) => {
    const user = await User.findById(userId);
    if (!user) {
        throw new Error('User not found');
    }
    return user;
};

module.exports = { login, loginFirebase, getMe, getUserByFirebaseUid };