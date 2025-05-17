require('dotenv').config();

const isProduction = process.env.NODE_ENV === 'production';

module.exports = {
    port: process.env.PORT || 8000,
    jwtSecret: process.env.JWT_SECRET,
    isProduction,
};  
