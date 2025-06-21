import 'dotenv/config';
import httpStatus from '../constants/httpStatus.js';
import { isProduction, frontendUrl } from '../config/appConfig.js';
import userService from '../services/userService.js';
import authService from '../services/authService.js';
import emailService from '../services/emailService.js';
import { hashPassword } from '../utils/passwordUtils.js';
import { generateToken, verifyToken } from '../utils/tokenUtils.js';
import { successResponse, failResponse, errorResponse } from '../utils/responseUtil.js';
import AppError from '../utils/appError.js';

const register = async (req, res) => {
    try {
        const { nama, email, password } = req.body;

        const existingUser = await userService.findByEmail(email);
        if (existingUser) {
            throw new AppError(`Email ${email} sudah terdaftar di sistem Ruang Ilmu`, httpStatus.BAD_REQUEST, 'email');
        }

        const hashedPassword = await hashPassword(password);
        const user = await userService.create(nama, email, hashedPassword);
        const token = generateToken({ id: user.user_id, role: user.role });

        const verificationLink = `${process.env.BASE_URL}/auth/verify-email?token=${token}`;
        await emailService.sendVerificationEmail(user.email, user.nama, verificationLink);

        return successResponse(
            res,
            httpStatus.CREATED,
            'Registrasi berhasil. Silakan periksa email anda untuk verifikasi',
            {
                user: {
                    id: user.user_id,
                    nama: user.nama,
                    email: user.email,
                    createdAt: user.created_at,
                    isVerified: user.is_verified,
                },
            }
        );
    } catch (error) {
        console.error(error);

        if (error instanceof AppError) {
            return failResponse(res, error.statusCode, 'Registrasi gagal', [
                {
                    field: error.field,
                    message: error.message
                }
            ]);
        }
        return errorResponse(res);
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const { user, accessToken, refreshToken } = await authService.login(email, password);

        // Hapus refresh token lama dari cookies (jika ada)
        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? 'none' : 'lax',
            path: '/'
        });

        // Set cookie untuk refresh token dengan konfigurasi berdasarkan environment
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? 'none' : 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000,
            path: '/',
            domain: isProduction ? process.env.COOKIE_DOMAIN : undefined
        });

        // Set headers untuk CORS
        res.header('Access-Control-Allow-Credentials', 'true');

        return successResponse(
            res,
            httpStatus.OK,
            'Login berhasil',
            {
                user: {
                    id: user.user_id,
                    nama: user.nama,
                    email: user.email,
                    createdAt: user.created_at,
                    isVerified: user.is_verified,
                },
                auth: {
                    accessToken,
                    tokenType: "Bearer",
                    expiresIn: 3600,
                },
            }
        );
    } catch (error) {
        console.error(error.message);

        if (error instanceof AppError) {
            return failResponse(res, error.statusCode, 'Login gagal, periksa kembali data yang Anda masukkan.', [
                {
                    field: error.field,
                    message: error.message
                }
            ]);
        }

        return errorResponse(res);
    }
};

const logout = (req, res) => {
    try {
        const refreshToken = req.cookies?.refreshToken;

        if (refreshToken) {
            // Clear cookie
            res.clearCookie('refreshToken', {
                httpOnly: true,
                secure: isProduction,
                sameSite: isProduction ? 'none' : 'lax',
                path: '/',
                domain: isProduction ? process.env.COOKIE_DOMAIN : undefined
            });

            return successResponse(
                res,
                httpStatus.OK,
                'Logout berhasil',
                null,
            );
        } else {
            throw new AppError('Refresh token tidak ditemukan', httpStatus.UNAUTHORIZED, 'refreshToken');
        }

    } catch (error) {
        console.error('Logout error:', error.message, error.stack);
        
        if (error instanceof AppError) {
            return failResponse(
                res,
                error.statusCode,
                'Logout gagal',
                [{ field: error.field || 'auth', message: error.message }],
            );
        }

        return errorResponse(res);
    }
};

const verifyEmail = async (req, res) => {
    try {
        const { token } = req.query;

        if (!token) {
            const message = 'Token verifikasi tidak ditemukan';
            return res.redirect(`${frontendUrl}/login?verified=false&error=${encodeURIComponent(message)}`);
        }

        const decoded = verifyToken(token);
        if (!decoded || !decoded.id) {
            const message = 'Token verifikasi tidak valid';
            return res.redirect(`${frontendUrl}/login?verified=false&error=${encodeURIComponent(message)}`);
        }

        await userService.verifyEmail(decoded.id);
        return res.redirect(`${frontendUrl}/login?verified=true&message=${encodeURIComponent('Email berhasil diverifikasi, silakan login')}`);
    } catch (error) {
        console.error('[VerifyEmail Error]', error.message);
        return res.redirect(`${frontendUrl}/login?verified=false&error=${encodeURIComponent(error.message || 'Token tidak valid atau sudah kadaluarsa')}`);
    }
};

const resendVerificationEmail = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            throw new AppError('Email harus diisi', httpStatus.BAD_REQUEST, 'email');
        }

        const result = await emailService.resendVerificationEmail(email);

        return successResponse(
            res,
            httpStatus.OK,
            result.message || 'Email verifikasi telah dikirim ulang',
            null,
        );
    } catch (error) {
        console.error(error.message);

        if (error instanceof AppError) {
            return failResponse(
                res,
                error.statusCode,
                'Gagal mengirim ulang email verifikasi',
                [{ field: error.field || 'email', message: error.message }],
            );
        }

        return errorResponse(res);
    }
};

const refreshToken = async (req, res) => {
    try {
        const refreshToken = req.cookies?.refreshToken;

        if (!refreshToken) {
            throw new AppError('Refresh token tidak ditemukan', httpStatus.UNAUTHORIZED, 'refreshToken');
        }

        let decoded;
        try {
            decoded = verifyToken(refreshToken);
        } catch (err) {
            // Hapus invalid cookie
            res.clearCookie('refreshToken', {
                httpOnly: true,
                secure: isProduction,
                sameSite: isProduction ? 'none' : 'lax',
                path: '/',
                domain: isProduction ? process.env.COOKIE_DOMAIN : undefined
            });

            throw new AppError('Token tidak valid atau kadaluarsa', httpStatus.UNAUTHORIZED, 'refreshToken');
        }

        const user = await userService.findById(decoded.id);
        if (!user) {
            throw new AppError('User tidak ditemukan', httpStatus.UNAUTHORIZED, 'user');
        }

        const accessToken = generateToken({ id: decoded.id, role: decoded.role });

        return successResponse(
            res,
            httpStatus.OK,
            'Token berhasil diperbarui',
            {
                auth: {
                    accessToken,
                    tokenType: "Bearer",
                    expiresIn: parseInt(process.env.JWT_ACCESS_EXPIRATION_SECONDS) || 3600
                }
            },
        );
    } catch (error) {
        console.error(error.message || error);

        if (error instanceof AppError) {
            return failResponse(
                res,
                error.statusCode,
                'Authentication gagal',
                [{ field: error.field || 'auth', message: error.message }],
            );
        }

        return errorResponse(res);
    }
};

const oauthGoogle = async (req, res) => {
    try {
        const { idToken } = req.body;

        if (!idToken) {
            throw new AppError('ID Token diperlukan', httpStatus.BAD_REQUEST, 'idToken');
        }

        const { user, accessToken, refreshToken } = await authService.loginFirebase(idToken);

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? 'none' : 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000,
            path: '/',
            domain: isProduction ? process.env.COOKIE_DOMAIN : undefined
        });

        // Set headers untuk CORS
        res.header('Access-Control-Allow-Credentials', 'true');

        return successResponse(
            res,
            httpStatus.OK,
            'Login dengan Google berhasil',
            {
                user: {
                    id: user.user_id,
                    nama: user.nama,
                    email: user.email,
                    isVerified: user.is_verified,
                },
                auth: {
                    accessToken,
                    tokenType: "Bearer",
                    expiresIn: parseInt(process.env.JWT_ACCESS_EXPIRATION_SECONDS) || 3600
                }
            },

        );

    } catch (error) {
        console.error(error.message);

        if (error instanceof AppError) {
            return failResponse(
                res,
                error.statusCode,
                'Login Google gagal',
                [{ field: error.field || 'auth', message: error.message }],
            );
        }

        return errorResponse(res);
    }
};

const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            throw new AppError('Email harus diisi', httpStatus.BAD_REQUEST, 'email');
        }

        const result = await userService.requestPasswordReset(email);

        return successResponse(
            res,
            httpStatus.OK,
            result.message,
            null,
        );
    } catch (error) {
        console.error(error.message);

        if (error instanceof AppError) {
            return failResponse(
                res,
                error.statusCode,
                'Permintaan reset password gagal',
                [{ field: error.field || 'email', message: error.message }],
            );
        }

        return errorResponse(res);
    }
};

const resetPassword = async (req, res) => {
    try {
        const { token } = req.query;
        const { password } = req.body;

        if (!token || !password) {
            const errors = [];
            if (!token) {
                errors.push({ field: 'token', message: 'Token tidak valid' });
            }
            if (!password) {
                errors.push({ field: 'newPassword', message: 'Password baru harus diisi' });
            }

            throw new AppError('Reset password gagal', httpStatus.BAD_REQUEST, null, errors);
        }

        const result = await userService.resetPassword(token, password);

        return successResponse(
            res,
            httpStatus.OK,
            result.message,
            null,
        );
    } catch (error) {
        console.error(error.message);

        if (error instanceof AppError) {
            return failResponse(
                res,
                error.statusCode || httpStatus.BAD_REQUEST,
                "Reset password gagal",
                error.errors.length ? error.errors : [{ field: error.field || 'reset', message: error.message }]
            );
        }

        if (error.message === 'Token sudah kadaluarsa') {
            return failResponse(
                res,
                httpStatus.UNAUTHORIZED,
                'Reset password gagal',
                [{ field: 'token', message: 'Token sudah kadaluarsa' }]
            );
        }

        return errorResponse(res);
    }
};

export default {
    register,
    login,
    logout,
    verifyEmail,
    resendVerificationEmail,
    refreshToken,
    oauthGoogle,    
    forgotPassword,
    verifyEmail,
    resendVerificationEmail,
    refreshToken,    
    resetPassword
};