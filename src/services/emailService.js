const fs = require('fs');
const nodeMailer = require('nodemailer');
const emailTemplate = fs.readFileSync('src/utils/verificationEmail.html', 'utf8');
const userService = require('../services/userService');
const { generateToken } = require('../utils/tokenUtils');


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
    const user = userService.findByEmail(email);
    if (!user) {
        throw new Error('Email tidak terdaftar');
    }
    
    if (user.isVerified) {
        throw new Error('Email sudah terverifikasi');
    }
    
    const token = generateToken({ id: user.user_id }, '24h');
    const verificationLink = `${process.env.BASE_URL}/auth/verify-email?token=${token}`;
    
    await emailService.sendVerificationEmail(user.email, user.nama, verificationLink);
    
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

module.exports = { sendVerificationEmail, resendVerificationEmail };