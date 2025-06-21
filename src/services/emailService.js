import 'dotenv/config';
import fs from 'fs';
import nodeMailer from 'nodemailer';
import httpStatus from '../constants/httpStatus.js';
import User from '../models/userModel.js';
import AppError from '../utils/appError.js';
import { generateToken } from '../utils/tokenUtils.js';

import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const emailTemplatePath = path.join(__dirname, '../utils/verificationEmail.html');
const emailTemplate = fs.readFileSync(emailTemplatePath, 'utf8');

const transporter = nodeMailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD
    }
});

const sendVerificationEmail = async (to, nama, linkVerif) => {
    const subject = 'Verifikasi Email Anda';

    let updatedTemplate = emailTemplate.replace('{{ nama }}', nama);
    updatedTemplate = updatedTemplate.replace('{{ verificationLink }}', linkVerif);

    const mailOptions = {
        from: process.env.EMAIL_USERNAME,
        to,
        subject,
        html: updatedTemplate,
    };

    return transporter.sendMail(mailOptions);
};

const resendVerificationEmail = async (email) => {
    const user = await User.findByEmail(email);
    if (!user) {
        throw new AppError('Email belum terdaftar di sistem Ruang Ilmu', httpStatus.NOT_FOUND, 'email');
    }

    if (user.isVerified) {
        throw new AppError('Email sudah terverifikasi', httpStatus.FORBIDDEN, 'email');
    }

    const token = generateToken({ id: user.user_id, role: user.role });
    const verificationLink = `${process.env.BASE_URL}/auth/verify-email?token=${token}`;

    // Kirim email verifikasi
    sendVerificationEmail(user.email, user.nama, verificationLink);

    return { message: 'Email verifikasi telah dikirim ulang' };
};

const sendResetPasswordEmail = async (to, nama, linkReset) => {
    const subject = 'Reset Password Anda';

    let updatedTemplate = emailTemplate.replace('{{ nama }}', nama);
    updatedTemplate = updatedTemplate.replace('{{ verificationLink }}', linkReset);

    const mailOptions = {
        from: process.env.EMAIL_USERNAME,
        to,
        subject,
        html: updatedTemplate,
    };

    return transporter.sendMail(mailOptions);
};

export default {
    sendVerificationEmail,
    resendVerificationEmail,
    sendResetPasswordEmail
}