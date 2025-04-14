const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config/appConfig');

const generateToken = (payload, expiresIn = '1h') => {
    return jwt.sign(payload, jwtSecret, { expiresIn });
};

const verifyToken = (token) => {
    return jwt.verify(token, jwtSecret);
};

module.exports = {
    generateToken,
    verifyToken
};