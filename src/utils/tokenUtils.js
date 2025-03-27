const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config/appConfig');

const generateToken = (payload, expiresIn = '1h') => {
    return jwt.sign(payload, jwtSecret, { expiresIn });
};

module.exports = {
    generateToken
};

