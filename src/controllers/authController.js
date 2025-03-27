const userService = require('../services/userService');
const authService = require('../services/authService');
const { hashPassword, comparePassword } = require('../utils/passwordUtils');
const { generateToken } = require('../utils/tokenUtils');
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

        res.status(httpStatus.CREATED).json({
            message: 'User registered successfully',
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
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            maxAge: 3 * 24 * 60 * 60 * 1000,
        });

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
        // Hapus refresh token dari cookies
        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
        });

        res.status(200).json({ message: 'Logout successful' });
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({ message: 'Server error during logout' });
    }
};


exports.getMe = async (req, res) => {
    try {
        const user = await authService.getMe(req.user.id);
        res.status(httpStatus.OK).json({ user });
    } catch (error) {
        console.error(error.message);
        res.status(httpStatus.NOT_FOUND).json({ message: error.message });
    }
};

exports.verifyEmail = async (req, res) => {
    try {

    } catch (error) {
        console.error(error.message);
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Server error' });
    }
};

exports.refreshToken = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
            return res.status(httpStatus.UNAUTHORIZED).json({ message: 'Refresh token not provided' });
        }

        const decoded = jwt.verify(refreshToken, jwtSecret);
        const accessToken = generateToken({ id: decoded.id, role: decoded.role }, '1h');

        res.status(httpStatus.OK).json({ accessToken });
    } catch (error) {
        return res.status(httpStatus.UNAUTHORIZED).json({ message: 'Invalid or expired refresh token' });
    }
};