const httpStatus = require('../constants/httpStatus');

const roleMiddleware = (roles) => {
    return (req, res, next) => {
        // Pastikan user sudah terautentikasi
        if (!req.user) {
            return res.status(httpStatus.UNAUTHORIZED).json({ message: 'Unauthorized' });
        }

        // Periksa apakah role user sesuai
        if (!roles.includes(req.user.role)) {
            return res.status(httpStatus.FORBIDDEN).json({ message: 'Access denied' });
        }

        next();
    };
};

module.exports = roleMiddleware;