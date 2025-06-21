import 'dotenv/config';

export const isProduction = process.env.NODE_ENV === 'production';
export const frontendUrl = process.env.NODE_ENV === 'production' ? process.env.FRONTEND_URL : 'http://localhost:3000';
export const port = process.env.PORT || 8000;
export const jwtSecret = process.env.JWT_SECRET;