const { jwtSecret } = require('../config/appConfig');
const userService = require('../services/userService');
const authService = require('../services/authService');
const emailService = require('../services/emailService');
const { hashPassword } = require('../utils/passwordUtils');
const { generateToken, verifyToken } = require('../utils/tokenUtils');
const httpStatus = require('../constants/httpStatus');

exports.register = async (req, res) => {
    try {
        const { nama, email, password } = req.body;

        const existingUser = await userService.findByEmail(email);
        if (existingUser) {
            return res.status(httpStatus.BAD_REQUEST).json({ message: 'Email already in use' });
        }

        const hashedPassword = await hashPassword(password);
        const user = await userService.create(nama, email, hashedPassword);
        const token = generateToken({ id: user.user_id, role: user.role });

        const verificationLink = `${process.env.BASE_URL}/auth/verify-email?token=${token}`;
        await emailService.sendVerificationEmail(user.email, user.nama, verificationLink);

        res.status(httpStatus.CREATED).json({
            message: 'Registrasi berhasil. Silakan periksa email anda untuk verifikasi',
            token,
            user: {
                id: user.user_id,
                nama: user.nama,
                email: user.email,
            },
        });
    } catch (error) {
        console.error(error);
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Server error' });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const { user, accessToken, refreshToken } = await authService.login(email, password);

        // Hapus refresh token lama dari cookies (jika ada)
        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
        });

        // Simpan token di cookies
        // res.cookie('refreshToken', refreshToken, {
        //     httpOnly: true,
        //     secure: true,
        //     sameSite: 'strict',
        //     maxAge: 3 * 24 * 60 * 60 * 1000,
        // });

        // res.cookie('refreshToken')

        // Simpan token di cookies (untuk pengujian lokal)
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: false, 
            sameSite: 'Lax', 
            maxAge: 3 * 24 * 60 * 60 * 1000,
            path: '/'
        });

        res.header('Access-Control-Allow-Credentials', 'true')

        res.status(httpStatus.OK).json({
            message: 'Login successful',
            accessToken,
            user: {
                id: user.user_id,
                nama: user.nama,
                email: user.email,
            },
        });
    } catch (error) {
        console.error(error.message);
        res.status(httpStatus.UNAUTHORIZED).json({ message: error.message });
    }
};

exports.logout = (req, res) => {
    try {
        const refreshToken = req.cookies?.refreshToken;

        if (refreshToken) {
            // Clear cookie
            res.clearCookie('refreshToken', {
                httpOnly: true,
                secure: true,
                sameSite: 'strict',
            });

            return res.status(200).json({ message: 'Logout successful' });
        } else {
            return res.status(400).json({ message: 'No refresh token found in cookies' });
        }

    } catch (error) {
        console.error('Logout error:', error.message, error.stack);
        res.status(500).json({ message: 'Server error during logout' });
    }
};

exports.verifyEmail = async (req, res) => {
    try {
        const { token } = req.query;
        const decoded = verifyToken(token, jwtSecret);

        await userService.verifyEmail(decoded.id);

        // res.status(httpStatus.OK).json({ message: 'Email berhasil diverifikasi' });
        return res.redirect('http://127.0.0.1:5500/login.html?message=Email berhasil diverifikasi, silakan login');
    } catch (error) {
        console.error(error.message);
        res.status(httpStatus.BAD_REQUEST).json({
            message: error.message || 'Token tidak valid atau sudah kadaluarsa',
        });
        return res.redirect('http://127.0.0.1:5500/login.html?error=Token tidak valid atau sudah kadaluarsa');
    }
};

exports.resendVerificationEmail = async (req, res) => {
    try {
        const { email } = req.body;
        
        if (!email) {
            return res.status(httpStatus.BAD_REQUEST).json({
                status: 'error',
                message: 'Email harus diisi'
            });
        }
        
        const result = await emailService.resendVerificationEmail(email);

        res.status(httpStatus.OK).json({
            status: 'success',
            message: result.message
        });
    } catch (error) {
        console.error(error.message);
        res.status(httpStatus.BAD_REQUEST).json({
            status: 'error',
            message: error.message
        });
    }
};

exports.refreshToken = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
            return res.status(httpStatus.UNAUTHORIZED).json({ message: 'Refresh token not provided' });
        }

        const decoded = verifyToken(refreshToken, jwtSecret);
        const accessToken = generateToken({ id: decoded.id, role: decoded.role }, '1h');

        res.status(httpStatus.OK).json({ accessToken });
    } catch (error) {
        return res.status(httpStatus.UNAUTHORIZED).json({ message: 'Invalid or expired refresh token' });
    }
};

exports.oauthGoogle = async (req, res) => {
    try {
        const { idToken }= req.body;

        if (!idToken) {
            return res.status(httpStatus.BAD_REQUEST).json({ message: 'ID token is required' });
        }

        const { user, accessToken, refreshToken } = await authService.loginFirebase(idToken);

        return res.status(httpStatus.OK).json({
            message: 'Login successful',
            accessToken,
            refreshToken,
            user: {
                id: user.user_id,
                nama: user.nama,
                email: user.email,
            },
        });

    } catch (error) {
        console.error(error.message);
        return res.status(httpStatus.UNAUTHORIZED).json({
            status: 'error',
            message: error.message
        });
    }
};

exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        
        if (!email) {
            return res.status(httpStatus.BAD_REQUEST).json({
                status: 'error',
                message: 'Email harus diisi'
            });
        }
        
        const result = await userService.requestPasswordReset(email);
        
        res.status(httpStatus.OK).json({
            status: 'success',
            message: result.message
        });
    } catch (error) {
        console.error(error.message);
        res.status(httpStatus.BAD_REQUEST).json({
            status: 'error',
            message: error.message
        });
    }
};

exports.resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body;
        
        if (!token || !newPassword) {
            return res.status(httpStatus.BAD_REQUEST).json({
                status: 'error',
                message: 'Token dan password baru harus diisi'
            });
        }
        
        if (newPassword.length < 6) {
            return res.status(httpStatus.BAD_REQUEST).json({
                status: 'error',
                message: 'Password minimal 6 karakter'
            });
        }
        
        const result = await userService.resetPassword(token, newPassword);
        
        res.status(httpStatus.OK).json({
            status: 'success',
            message: result.message
        });
    } catch (error) {
        console.error(error.message);
        res.status(httpStatus.BAD_REQUEST).json({
            status: 'error',
            message: error.message
        });
    }
};