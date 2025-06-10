const fs = require('fs');
const nodeMailer = require('nodemailer');
const emailTemplate = fs.readFileSync('src/utils/verificationEmail.html', 'utf8');
const User = require('../models/userModel');
const { generateToken } = require('../utils/tokenUtils');
const AppError = require('../utils/appError');
const httpStatus = require('../constants/httpStatus');
require('dotenv').config();

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

module.exports = { sendVerificationEmail, resendVerificationEmail, sendResetPasswordEmail };