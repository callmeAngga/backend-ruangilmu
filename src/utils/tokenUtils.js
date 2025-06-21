import jwt from 'jsonwebtoken';
import { jwtSecret } from '../config/appConfig.js';

export const generateToken = (payload, expiresIn = '1h') => {
    return jwt.sign(payload, jwtSecret, { expiresIn });
};

export const verifyToken = (token) => {
    return jwt.verify(token, jwtSecret);
};