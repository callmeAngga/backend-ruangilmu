const fs = require('fs');
const nodeMailer = require('nodemailer');
const emailTemplate = fs.readFileSync('src/utils/verificationEmail.html', 'utf8');

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

    // emailTemplate = emailTemplate.replace('{{nama}}', nama);    
    // emailTemplate = emailTemplate.replace('{{verificationLink}}', html);

    const mailOptions = {
        from: process.env.EMAIL_USERNAME,
        to,
        subject,
        html: updatedTemplate,
    };

    return transporter.sendMail(mailOptions);
};

module.exports = { sendVerificationEmail };