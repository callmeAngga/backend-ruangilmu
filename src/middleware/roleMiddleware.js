const httpStatus = require('../constants/httpStatus');
const { failResponse } = require('../utils/responseUtil');

const roleMiddleware = (roles) => {
    return (req, res, next) => {
        // Pastikan user sudah terautentikasi
        if (!req.user) {
            return failResponse(res, httpStatus.UNAUTHORIZED, 'User not authenticated', [
                {
                    field: 'Authorization',
                    message: 'Maaf anda harus login terlebih dahulu untuk mengakses endpoint ini'
                }
            ]);
        }

        // Periksa apakah role user sesuai
        if (!roles.includes(req.user.role)) {
            return failResponse(res, httpStatus.FORBIDDEN, 'Access denied', [
                {
                    field: 'role',
                    message: `User does not have the required role(s): ${roles.join(', ')}`
                }
            ]); 
        }

        next();
    };
};

module.exports = roleMiddleware;