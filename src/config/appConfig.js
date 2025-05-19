require('dotenv').config();

const isProduction = process.env.NODE_ENV === 'production';
const frontendUrl = process.env.NODE_ENV === 'production' ? process.env.FRONTEND_URL : 'http://localhost:3000';

module.exports = {
    port: process.env.PORT || 8000,
    jwtSecret: process.env.JWT_SECRET,
    isProduction,
    frontendUrl,
};  
